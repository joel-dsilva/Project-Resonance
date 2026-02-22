package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

const (
	MaxFileSize = 50 * 1024 * 1024
	UploadDir   = "./temp_audio"
)

// --- WEBSOCKET HUB LOGIC ---

// WSEvent is the standard JSON structure we push to Owner A's React frontend
type WSEvent struct {
	Type    string          `json:"type"`              // "status" or "result"
	Message string          `json:"message,omitempty"` // For text updates
	Data    json.RawMessage `json:"data,omitempty"`    // For the final clean JSON
}

var (
	clients   = make(map[*websocket.Conn]bool) // Tracks active React connections
	clientsMu sync.Mutex                       // Prevents race conditions
)

// broadcast pushes a WSEvent to all connected React clients
func broadcast(event WSEvent) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for client := range clients {
		err := client.WriteJSON(event)
		if err != nil {
			log.Printf("WebSocket error, disconnecting client: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
}

// --- BRIDGE LOGIC ---
func sendToPythonWorker(filePath string, pythonAPIUrl string) ([]byte, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	bodyReader, bodyWriter := io.Pipe()
	multiWriter := multipart.NewWriter(bodyWriter)

	go func() {
		defer bodyWriter.Close()
		defer multiWriter.Close()
		part, err := multiWriter.CreateFormFile("file", filepath.Base(filePath))
		if err != nil {
			log.Printf("CreateFormFile error: %v", err)
			return
		}
		if _, err := io.Copy(part, file); err != nil {
			log.Printf("io.Copy error: %v", err)
		}
	}()

	req, _ := http.NewRequest("POST", pythonAPIUrl, bodyReader)
	req.Header.Set("Content-Type", multiWriter.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to reach Python worker: %v", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("python worker returned error %d: %s", resp.StatusCode, string(bodyBytes))
	}

	return bodyBytes, nil
}

// --- MAIN SERVER ---
func main() {
	os.MkdirAll(UploadDir, os.ModePerm)

	app := fiber.New(fiber.Config{BodyLimit: MaxFileSize})
	app.Use(logger.New())
	app.Use(cors.New())

	// WebSocket Upgrade Middleware
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// 1. The WebSocket Endpoint for Owner A (React)
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		// Register new client
		clientsMu.Lock()
		clients[c] = true
		clientsMu.Unlock()

		log.Println("Frontend connected to WebSocket!")

		// Listen for disconnects
		defer func() {
			clientsMu.Lock()
			delete(clients, c)
			clientsMu.Unlock()
			c.Close()
			log.Println("Frontend disconnected.")
		}()

		// Keep connection alive
		for {
			if _, _, err := c.ReadMessage(); err != nil {
				break
			}
		}
	}))

	// 2. The Audio Upload Endpoint
	app.Post("/api/upload", func(c *fiber.Ctx) error {
		file, err := c.FormFile("audio")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing audio"})
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext != ".wav" && ext != ".mp3" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only .wav and .mp3 allowed"})
		}

		savePath := filepath.Join(UploadDir, file.Filename)
		c.SaveFile(file, savePath)

		// Broadcast that upload finished and processing is starting
		broadcast(WSEvent{Type: "status", Message: "Upload complete. Sending to AI Worker..."})

		pythonWorkerURL := "https://edgardo-interdestructive-nondeprecatorily.ngrok-free.dev/separate"
		responseBytes, err := sendToPythonWorker(savePath, pythonWorkerURL)
		if err != nil {
			log.Printf("Bridge Error: %v\n", err)
			broadcast(WSEvent{Type: "status", Message: "Error: AI Worker offline."})
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI Worker failed"})
		}

		// Rewrite the relative Python paths to absolute Ngrok URLs for the frontend
		var respData map[string]interface{}
		if err := json.Unmarshal(responseBytes, &respData); err == nil {
			if stems, ok := respData["stems"].(map[string]interface{}); ok {
				baseURL := "https://edgardo-interdestructive-nondeprecatorily.ngrok-free.dev"
				for k, v := range stems {
					if pathStr, ok := v.(string); ok {
						stems[k] = baseURL + pathStr
					}
				}
				if updatedBytes, err := json.Marshal(respData); err == nil {
					responseBytes = updatedBytes
				}
			}
		}

		broadcast(WSEvent{Type: "status", Message: "AI Worker processing complete."})

		c.Set("Content-Type", "application/json")
		return c.Send(responseBytes)
	})

	log.Println("Go Gateway running on http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}

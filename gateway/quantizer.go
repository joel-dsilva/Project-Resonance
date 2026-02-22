package main

import (
	"encoding/json"
	"math"
)

// Note represents the strict JSON contract for a single MIDI event.
type Note struct {
	Pitch      int     `json:"pitch"`
	StartTime  float64 `json:"startTime"`
	Duration   float64 `json:"duration"`
	Confidence float64 `json:"confidence"`
}

// MIDIData represents the payload sent by Python.
type MIDIData struct {
	BPM   float64 `json:"bpm"`
	Notes []Note  `json:"notes"`
}

// Quantize cleans the messy ML data and snaps it to a 16th-note grid
func Quantize(rawJSON []byte, confidenceThreshold float64) ([]byte, error) {
	var data MIDIData
	if err := json.Unmarshal(rawJSON, &data); err != nil {
		return nil, err
	}

	// Calculate the grid size in seconds for a 16th note
	sixteenthNoteGrid := (60.0 / data.BPM) / 4.0

	var cleanNotes []Note

	for _, note := range data.Notes {
		// 1. Filter the Noise (Drop ghost notes and micro-blips)
		if note.Confidence < confidenceThreshold {
			continue
		}
		if note.Duration < (sixteenthNoteGrid / 2.0) {
			continue
		}

		// 2. Snap to Grid (Mathematical rounding to the nearest 16th note)
		snappedStart := math.Round(note.StartTime/sixteenthNoteGrid) * sixteenthNoteGrid
		snappedDuration := math.Round(note.Duration/sixteenthNoteGrid) * sixteenthNoteGrid
		
		// Ensure notes have a minimum length so sheet music renders correctly
		if snappedDuration == 0 {
			snappedDuration = sixteenthNoteGrid
		}

		cleanNotes = append(cleanNotes, Note{
			Pitch:      note.Pitch,
			StartTime:  snappedStart,
			Duration:   snappedDuration,
			Confidence: note.Confidence,
		})
	}

	// Pack the clean notes back into the struct
	data.Notes = cleanNotes

	// Return the perfectly formatted JSON
	return json.Marshal(data)
}
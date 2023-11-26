package types

import "encoding/json"

type Payload = json.RawMessage

type ServiceMsg struct {
	Pattern string  `json:"pattern"`
	Data    Payload `data:"payload"`
}

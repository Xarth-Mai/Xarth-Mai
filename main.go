package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
)

const VERSION = "0.0.1"
const SOCK_PATH = "/run/xarth-mai/app.sock"

func main() {
	if err := os.RemoveAll(SOCK_PATH); err != nil {
		fmt.Printf("Error removing old socket: %v\n", err)
	}

	listener, err := net.Listen("unix", SOCK_PATH)
	if err != nil {
		fmt.Printf("Error listening on socket: %v\n", err)
		return
	}
	defer listener.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World")
	})

	// api/version -> json {version: $VERSION}
	http.HandleFunc("/api/version", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{version: %s}", VERSION)
	})

	fmt.Printf("Listening on %s\n", SOCK_PATH)
	if err := http.Serve(listener, nil); err != nil {
		fmt.Printf("Error serving: %v\n", err)
	}
}

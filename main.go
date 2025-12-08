package main

import (
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/Xarth-Mai/handles"
)

const VERSION = "0.0.1"
const SOCK_PATH = "/run/xarth-mai/app.sock"

func main() {
	// remove old socket
	if err := os.RemoveAll(SOCK_PATH); err != nil {
		fmt.Printf("Error removing old socket: %v\n", err)
	}

	// listen on socket
	listener, err := net.Listen("unix", SOCK_PATH)
	if err != nil {
		fmt.Printf("Error listening on socket: %v\n", err)
		return
	}

	// close socket when program exit
	defer listener.Close()

	// serve frontend
	http.Handle("/", http.FileServer(http.Dir("./public")))

	// serve api/version
	http.HandleFunc("/api/version", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"version\": \"%s\"}", VERSION)
	})

	// serve other api
	http.HandleFunc("/api", handles.Router)

	// serve and print log
	fmt.Printf("Listening on %s\n", SOCK_PATH)
	if err := http.Serve(listener, nil); err != nil {
		fmt.Printf("Error serving: %v\n", err)
	}
}

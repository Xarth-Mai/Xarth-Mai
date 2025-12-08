package handles

import "net/http"

func Router(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
}

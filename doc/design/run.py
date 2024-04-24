import webbrowser
import os

import http.server

current_directory = os.path.dirname(os.path.abspath(__file__))
os.chdir(current_directory)

server_address = ('', 8000)
httpd = http.server.HTTPServer(
    server_address, http.server.SimpleHTTPRequestHandler)

webbrowser.open('http://localhost:8000')

httpd.serve_forever()

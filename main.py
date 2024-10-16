import os
import requests
from flask import Flask, request, jsonify, render_template
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

app = Flask(__name__)

def update_images_from_drive(access_token, folder_id, images_dir='static/images'):
    try:
        # Crear las credenciales utilizando el token de acceso
        creds = Credentials(token=access_token)
        
        # Crear el servicio de Google Drive
        service = build('drive', 'v3', credentials=creds)

        # Listar los archivos en la carpeta especificada
        results = service.files().list(
            q=f"'{folder_id}' in parents and mimeType contains 'image/'",
            fields="files(id, name)"
        ).execute()
        items = results.get('files', [])

        if not items:
            print('No se encontraron archivos en la carpeta especificada.')
            return

        # Crear la carpeta /images si no existe
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)

        # Descargar todas las imágenes desde Google Drive y guardarlas en /images
        for item in items:
            file_id = item['id']
            file_name = item['name']

            file_path = os.path.join(images_dir, file_name)

            # Descargar la imagen
            downloader = requests.get(f'https://www.googleapis.com/drive/v3/files/{file_id}?alt=media',
                                      headers={'Authorization': f'Bearer {access_token}'})
            if downloader.status_code == 200:
                with open(file_path, 'wb') as f:
                    f.write(downloader.content)
                    print(f'Imagen {file_name} descargada y guardada en {file_path}')
            else:
                print(f'Error al descargar la imagen {file_name}: {downloader.status_code}')

    except HttpError as error:
        print(f'Ocurrió un error al interactuar con Google Drive: {error}')
    except Exception as e:
        print(f'Ocurrió un error: {e}')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_images', methods=['POST'])
def update_images():
    data = request.json
    access_token = data.get('access_token')
    folder_id = data.get('folder_id')

    if not access_token or not folder_id:
        return jsonify({'error': 'access_token y folder_id son requeridos'}), 400

    update_images_from_drive(access_token, folder_id)
    return jsonify({'status': 'Imágenes actualizadas con éxito'})

@app.route('/get_images_list', methods=['GET'])
def get_images_list():
    images_dir = 'static/images'
    try:
        # Obtener la lista de archivos en la carpeta /images
        images = os.listdir(images_dir) if os.path.exists(images_dir) else []
        return jsonify({'images': images})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


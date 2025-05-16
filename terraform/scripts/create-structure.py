from google.cloud import firestore
from google.oauth2 import service_account

def initialize_db():
    creds = service_account.Credentials.from_service_account_file(
        "/home/andresmendozav23/firebase-service-account.json")
    return firestore.Client(credentials=creds, project="crud-autos-459913")

def create_structure(db):
    # Documento de configuración inicial
    db.collection('config').document('app').set({
        'name': 'TallerAutos',
        'version': '1.0',
        'collections': ['clientes', 'autos', 'facturas']
    })
    print("✅ Estructura creada: Colecciones 'clientes', 'autos' y 'facturas' definidas")

if __name__ == "__main__":
    db = initialize_db()
    create_structure(db)
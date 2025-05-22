from google.cloud import firestore
from google.oauth2 import service_account
from datetime import datetime

def initialize_db():
    creds = service_account.Credentials.from_service_account_file(
        "/home/andresmendozav23/firebase-service-account.json")
    return firestore.Client(
        credentials=creds,
        project="crud-autos-459913",
        database="tallerautosdb"  
    )

def insert_and_view(db):
    print(f"\n🔄 Insertando datos en la base 'tallerautosdb'...")
    
    cliente_ref = db.collection('clientes').document('cliente01')
    cliente_ref.set({
        'nombre': 'Ana López',
        'email': 'ana@taller.com',
        'telefono': '+56987654321'
    })
    
    db.collection('facturas').document('factura01').set({
        'total': 250000,
        'fecha': datetime.now(),
        'clienteId': 'cliente01',
        'autoId': 'auto01',
        'servicios': ['Cambio de aceite', 'Revisión general']
    })
    print("\n🔍 Visualizando datos de 'tallerautosdb':")
    

if __name__ == "__main__":
    db = initialize_db()
    insert_and_view(db)
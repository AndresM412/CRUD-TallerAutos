from google.cloud import firestore
from google.oauth2 import service_account
from datetime import datetime

def initialize_db():
    creds = service_account.Credentials.from_service_account_file(
        "/home/andresmendozav23/firebase-service-account.json")
    return firestore.Client(credentials=creds, project="crud-autos-459913")

def insert_and_view(db):
    # ===== PARTE 1: INSERCIÓN =====
    print("\n🔄 Insertando datos de muestra...")
    
    # Datos de ejemplo
    cliente_ref = db.collection('clientes').document('cliente01')
    cliente_ref.set({
        'nombre': 'Ana López',
        'email': 'ana@taller.com',
        'telefono': '+56987654321'
    })
    
    auto_ref = db.collection('autos').document('auto01')
    auto_ref.set({
        'marca': 'Toyota',
        'modelo': 'Corolla',
        'año': 2022,
        'clienteId': 'cliente01'
    })
    
    db.collection('facturas').document('factura01').set({
        'total': 250000,
        'fecha': datetime.now(),
        'clienteId': 'cliente01',
        'autoId': 'auto01',
        'servicios': ['Cambio de aceite', 'Revisión general']
    })
    
    print("✔️ Datos insertados: 1 cliente, 1 auto, 1 factura")
    
    # ===== PARTE 2: VISUALIZACIÓN =====
    print("\n🔍 Visualizando datos actuales:")
    
    def print_collection(name):
        print(f"\n📦 Colección: {name}")
        for doc in db.collection(name).stream():
            print(f"  📄 ID: {doc.id}")
            for k, v in doc.to_dict().items():
                print(f"    - {k}: {v}")
    
    for collection in ['clientes', 'autos', 'facturas']:
        print_collection(collection)
    
    print("\n✅ Operación completada")

if __name__ == "__main__":
    db = initialize_db()
    insert_and_view(db)
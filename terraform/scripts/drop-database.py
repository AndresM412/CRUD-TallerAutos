from google.cloud import firestore
from google.oauth2 import service_account

def initialize_db():
    creds = service_account.Credentials.from_service_account_file(
        "/home/andresmendozav23/firebase-service-account.json")
    return firestore.Client(
        credentials=creds,
        project="crud-autos-459913",
        database="tallerautosdb"  # ¡Nuevo! Nombre personalizado
    )

def delete_all_data(db):
    print("🚨 ADVERTENCIA: Esto borrará TODOS los datos de 'tallerautosdb'")
    confirm = input("¿Confirmas? (escribe 'borrar' para continuar): ")
    
    if confirm.lower() == 'borrar':
        print("\n🗑️ Eliminando datos de 'tallerautosdb'...")
        collections = ['clientes', 'autos', 'facturas', 'config']
        
        for collection in collections:
            print(f" - Eliminando {collection}...")
            docs = db.collection(collection).stream()
            for doc in docs:
                doc.reference.delete()
        
        print("\n✅ Base de datos completamente vaciada")
    else:
        print("❌ Operación cancelada")

if __name__ == "__main__":
    db = initialize_db()
    delete_all_data(db)
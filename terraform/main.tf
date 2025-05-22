terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.0.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# =====================
# Variables
# =====================
variable "gcp_project_id" {
  description = "ID del proyecto GCP"
  type        = string
  default     = "crud-autos-459913"
}

variable "gcp_region" {
  description = "Región de GCP"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "Zona para la VM"
  type        = string
  default     = "us-central1-a"
}

# =====================
# Recursos
# =====================

# Habilitar Firestore API
resource "google_project_service" "firestore" {
  project = var.gcp_project_id
  service = "firestore.googleapis.com"
}

# Crear la base de datos Firestore
resource "google_firestore_database" "default" {
  project     = var.gcp_project_id
  name        = "tallerautosdb2"
  location_id = "nam5" 
  type        = "FIRESTORE_NATIVE"
  
  depends_on = [google_project_service.firestore]
}

# Cuenta de servicio personalizada para la VM
resource "google_service_account" "vm_sa" {
  account_id   = "firestore-vm-sa"
  display_name = "Firestore VM Service Account"
}

# Asignar roles necesarios a la cuenta de servicio
resource "google_project_iam_member" "vm_sa_roles" {
  for_each = toset([
    "roles/datastore.user",
    "roles/logging.logWriter",
    "roles/storage.objectViewer",
    "roles/firebase.admin" # Permiso adicional para administración completa
  ])
  project = var.gcp_project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.vm_sa.email}"
}

# Instancia de VM para administración
resource "google_compute_instance" "admin_instance" {
  name         = "firestore-admin"
  machine_type = "e2-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network       = "default"
    access_config {}
  }

  metadata = {
    ssh-keys = "andresmendozav23:${file("C:/Users/andre.ANDRESPC/.ssh/id_rsa.pub")}"
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    apt-get update
    apt-get install -y python3-pip
    pip3 install google-cloud-firestore
    gsutil cp gs://${google_storage_bucket.firestore_scripts_bucket.name}/init-datastore.py /home/andresmendozav23/
    chown andresmendozav23:andresmendozav23 /home/andresmendozav23/init-datastore.py
  EOF

  service_account {
    email  = google_service_account.vm_sa.email
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
  }
  
  depends_on = [google_firestore_database.default]
}

# Bucket de Cloud Storage para scripts
resource "google_storage_bucket" "firestore_scripts_bucket" {
  name          = "crud-autos-project-firestore-scripts"
  location      = var.gcp_region
  project       = var.gcp_project_id
  force_destroy = true  # <-- Esta línea es crucial
}

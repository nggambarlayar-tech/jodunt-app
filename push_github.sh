#!/bin/bash

# --- Script untuk Upload/Push Otomatis ke GitHub ---

# 1. Meminta input URL Repositori GitHub
read -p "Masukkan URL Repositori GitHub Anda (contoh: https://github.com/user/repo.git): " REPO_URL

# 2. Meminta pesan commit
read -p "Masukkan pesan commit (tekan enter untuk default 'Initial commit'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Initial commit: Aplikasi E-Commerce ManisDonat"}

echo "Memulai proses upload ke GitHub..."

# Inisialisasi git jika belum ada
if [ ! -d ".git" ]; then
    git init
    echo "Git berhasil diinisialisasi."
fi

# Menambahkan semua file
git add .

# Membuat commit
git commit -m "$COMMIT_MSG"

# Mengubah nama branch utama menjadi 'main' (standar GitHub terbaru)
git branch -M main

# Menghapus remote origin lama jika ada, lalu menambahkan yang baru
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

# Mendorong (push) kode ke GitHub
git push -u origin main

echo "================================================="
echo "✅ Berhasil! Kode Anda telah diunggah ke GitHub."
echo "Silakan cek di: $REPO_URL"
echo "================================================="
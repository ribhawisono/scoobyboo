# PWD
# SALMA CAKE BAKERY - WEBSITE E-COMMERCE UMKM KUE CUSTOM

## Deskripsi Proyek
Proyek ini adalah sebuah website statis responsif yang dikembangkan sebagai tugas praktik mata kuliah Pemrograman Web Dasar. Website ini berfungsi sebagai etalase digital (e-commerce) untuk UMKM 'Salma Cake Bakery', yang melayani pemesanan kue ulang tahun custom secara online.

Fokus utama proyek ini adalah menerapkan praktik terbaik Front-End Development, termasuk penggunaan CSS Grid/Flexbox, Custom Properties (CSS Variables), dan JavaScript DOM Manipulation untuk fungsionalitas perhitungan harga.

## Fitur Utama

### 1. Desain & Navigasi
* **Desain Responsif:** Layout dioptimalkan untuk tampilan desktop, tablet, dan mobile (@media queries di 992px dan 768px).
* **Tema Cokelat Hangat:** Menggunakan skema warna cokelat (`--primary-color: #8B4513`) dan krem (`--secondary-color: #EAC964`) untuk memberikan nuansa yang hangat dan premium.
* **Navigasi Jelas:** Terdapat 5 halaman utama: Home, About, Shop (Form Order), Gallery, dan Contact.

### 2. Fungsionalitas E-Commerce (Form Order)
* **Perhitungan Harga Dinamis:** Menggunakan `javascript.js` untuk menghitung total estimasi harga secara real-time berdasarkan pilihan pengguna (Ukuran Kue dan Base Cake Premium) serta Add-ons yang dicentang.
* **Penyimpanan Data:** Menggunakan `localStorage` untuk menyimpan detail pesanan dan harga, memungkinkan data tersebut dibawa dari `form-order.html` ke halaman `checkout.html`.
* **Validasi UI:** Logika sederhana di JS untuk menampilkan/menyembunyikan kolom alamat pengiriman berdasarkan pilihan 'Ambil Sendiri' atau 'Kirim'.

### 3. Komponen Interaktif
* **Card Slider Testimoni:** Menggunakan Flexbox dan JavaScript (`script-slider.js` dan `style-slider.css`) yang terpisah dari file utama (modular) untuk menampilkan testimoni pelanggan secara interaktif di halaman utama.
* **Gallery (CSS Grid):** Halaman Gallery menggunakan CSS Grid (`auto-fit, minmax`) untuk memastikan tampilan katalog kue yang fleksibel dan rapi.

## Struktur File
|-- css/
|   |-- style.css          # CSS Utama (Layout, Global, Halaman Dasar)
|   |-- style-slider.css   # CSS Khusus untuk Komponen Card Slider
|-- js/
|   |-- javascript.js      # JS Utama (Logika Harga Form Order & Checkout)
|   |-- script-slider.js   # JS Khusus untuk Fungsionalitas Geser Slider
|-- img/
|   |-- hero-bg.jpg        # Gambar latar Hero
|   |-- kue-placeholder-*.jpg # Gambar contoh kue
|-- index.html
|-- about.html
|-- form-order.html
|-- checkout.html
|-- gallery.html
|-- contact.html


## Teknologi yang Digunakan
* **HTML5** (Semantik)
* **CSS3** (Custom Properties, Flexbox, CSS Grid, Media Queries)
* **JavaScript (Vanilla JS)** (DOM Manipulation, Event Listeners, localStorage, Intl.NumberFormat)
* **Font Awesome** (Ikon pada Slider)

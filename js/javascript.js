// LOGIKA PERHITUNGAN HARGA & PEMROSESAN FORM ORDER (Halaman form-order.html)

const HARGA_DASAR_UKURAN = {
    '15_cm': 150000,
    '20_cm': 250000,
    '20x20_cm': 300000
};

// Fungsi utilitas untuk memformat angka menjadi Rupiah
function formatRupiah(angka) {
    if (isNaN(angka)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi utama untuk menghitung dan menampilkan total harga
function hitungHarga() {
    let hargaDasar = 0;
    let totalAddons = 0;

    if (!document.getElementById('customOrderForm')) return;

    // 1. Hitung Harga Dasar berdasarkan Ukuran
    const ukuranElement = document.getElementById('ukuran');
    const ukuranValue = ukuranElement ? ukuranElement.value : null;
    hargaDasar = HARGA_DASAR_UKURAN[ukuranValue] || 0;

    // 2. Tambahan untuk Base Cake premium (Red Velvet)
    const baseCakeElement = document.getElementById('base_cake');
    if (baseCakeElement && baseCakeElement.value === 'red_velvet') {
        hargaDasar += 25000;
    }

    // 3. Hitung Harga Add-ons
    const addonsCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
    addonsCheckboxes.forEach(checkbox => {
        const price = parseInt(checkbox.getAttribute('data-price'));
        totalAddons += price;
    });

    // 4. Hitung Total Estimasi
    const totalEstimasi = hargaDasar + totalAddons;

    // 5. Update Tampilan Ringkasan Harga
    document.getElementById('harga_dasar').textContent = formatRupiah(hargaDasar);
    document.getElementById('total_addons').textContent = formatRupiah(totalAddons);
    document.getElementById('total_estimasi').textContent = formatRupiah(totalEstimasi);

    // 6. Menyimpan data penting ke localStorage untuk Checkout
    localStorage.setItem('hargaDasar', hargaDasar);
    localStorage.setItem('totalAddons', totalAddons);
    localStorage.setItem('totalEstimasi', totalEstimasi);
    // Simpan teks yang dipilih, menghilangkan bagian harga/deskripsi tambahan jika ada
    localStorage.setItem('order_ukuran', ukuranElement.options[ukuranElement.selectedIndex].text.split(' - ')[0]);
    localStorage.setItem('order_base_cake', baseCakeElement.options[baseCakeElement.selectedIndex].text.split(' (')[0]);
}



// LOGIKA CHECKOUT (Halaman checkout.html)

// Memuat dan menampilkan detail pesanan di halaman checkout
function loadCheckoutDetails() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    if (!checkoutSummary) return;

    // Ambil data dari localStorage
    const totalEstimasi = parseInt(localStorage.getItem('totalEstimasi')) || 0;
    const orderDetails = {
        ukuran: localStorage.getItem('order_ukuran') || 'N/A',
        base_cake: localStorage.getItem('order_base_cake') || 'N/A',
        tanggal: localStorage.getItem('order_tanggal') || 'N/A'
    };

    // Update elemen tampilan
    document.getElementById('checkout_ukuran').textContent = orderDetails.ukuran;
    document.getElementById('checkout_base_cake').textContent = orderDetails.base_cake;
    document.getElementById('checkout_tanggal').textContent = orderDetails.tanggal;
    
    // Total Akhir
    document.getElementById('checkout_total').textContent = formatRupiah(totalEstimasi);
}

// Logika untuk menampilkan/menyembunyikan kolom alamat di halaman checkout
function setupCheckoutToggles() {
    const kirimRadio = document.getElementById('kirim');
    const ambilRadio = document.getElementById('ambil');
    const alamatKirimDiv = document.getElementById('alamat_kirim');

    if (!kirimRadio || !ambilRadio || !alamatKirimDiv) return;

    const toggleAlamat = () => {
        if (kirimRadio.checked) {
            alamatKirimDiv.style.display = 'block';
            alamatKirimDiv.querySelector('textarea').setAttribute('required', 'required');
        } else {
            alamatKirimDiv.style.display = 'none';
            alamatKirimDiv.querySelector('textarea').removeAttribute('required');
        }
    };

    kirimRadio.addEventListener('change', toggleAlamat);
    ambilRadio.addEventListener('change', toggleAlamat);
    
    // Panggil sekali saat load untuk setting default
    toggleAlamat(); 
}



// LOGIKA GALLERY FILTER (Halaman gallery.html)
// Catatan: Fungsi ini TIDAK HARUS ADA di javascript.js jika sudah ada di file terpisah
// Tapi jika Anda ingin menggabungkannya, masukkan di sini
// Karena Anda punya fungsi ini di blok DOMContentLoaded yang lain, kita pindahkan ke bawah

// --- FUNGSI UTAMA FILTERING (Penting: Hanya dipanggil di halaman gallery.html) ---
function applyFilter(filter) {
    const filterButtons = document.querySelectorAll('.katalog-filter button');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // 1. Reset class 'active' pada semua tombol filter
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // 2. Tampilkan/Sembunyikan item galeri
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'semua' || category === filter) {
            item.style.display = 'block'; 
        } else {
            item.style.display = 'none'; 
        }
    });

    // 3. Set tombol yang sesuai menjadi 'active'
    const activeBtn = document.querySelector(`.katalog-filter button[data-filter="${filter}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    } else {
        // Jika filter tidak ditemukan, set 'semua' sebagai default
        document.querySelector('.katalog-filter button[data-filter="semua"]').classList.add('active');
    }
}

// Setup Event Listeners untuk Gallery Filter
function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.katalog-filter button');
    if (filterButtons.length === 0) return;

    // Logika On-Click Tombol
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });

    // Logika URL Parameter (Filtering otomatis saat halaman dimuat)
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter'); 

    if (initialFilter) {
        applyFilter(initialFilter);
    } else {
        applyFilter('semua');
    }
}



// SETUP GLOBAL (Dipanggil saat DOM siap)

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi logika Form Order (jika elemen customOrderForm ada)
    const customOrderForm = document.getElementById('customOrderForm');
    if (customOrderForm) {
        // Panggil hitungHarga saat semua input berubah
        document.querySelectorAll('#customOrderForm select, #customOrderForm input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', hitungHarga);
        });

        // Submit Form -> Redirect ke Checkout
        customOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simpan tanggal ambil/kirim
            localStorage.setItem('order_tanggal', document.getElementById('tanggal_ambil').value);
            window.location.href = 'checkout.html';
        });

        // Hitung harga awal saat halaman dimuat
        hitungHarga();
    }

    // Inisialisasi logika Checkout (jika elemen checkoutSummary ada)
    if (document.getElementById('checkoutSummary')) {
        loadCheckoutDetails();
        setupCheckoutToggles();
    }

    // Inisialisasi logika Gallery Filter (jika tombol filter ada)
    if (document.querySelector('.katalog-filter')) {
        setupGalleryFilter();
    }
});
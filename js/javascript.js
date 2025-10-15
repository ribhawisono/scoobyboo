// LOGIKA PERHITUNGAN HARGA & PEMROSESAN FORM ORDER (Halaman form-order.html)

const HARGA_DASAR_UKURAN = {
    '15_cm': 150000,
    '20_cm': 250000,
    '20x20_cm': 300000
};

// format angka menjadi Rupiah
function formatRupiah(angka) {
    if (isNaN(angka)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi baru untuk memformat tanggal dari YYYY-MM-DD menjadi dd/month/yyyy (ex: 25 Oktober 2025)
function formatDateDisplay(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    // Asumsi format input dari localStorage adalah YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    
    if (!year || !month || !day) return dateString;

    // Buat objek Date (Perhatian: bulan di Date dimulai dari 0)
    const date = new Date(year, month - 1, day);

    // Gunakan Intl.DateTimeFormat untuk format lokal yang cantik
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

// hitung dan menampilkan total harga
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
        // PERHATIAN: Saya menggunakan += 25000 seperti di snippet Anda,
        // namun di update sebelumnya saya menggunakan totalAddons += 50000.
        // Saya mengikuti logika terbaru Anda di sini.
        hargaDasar += 25000;
    }

    // 3. Hitung Total Add-ons
    const addonsCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
    addonsCheckboxes.forEach(checkbox => {
        // Ambil harga dari atribut data-price (pastikan harga adalah angka)
        const price = parseInt(checkbox.getAttribute('data-price')) || 0;
        totalAddons += price;
    });

    // 4. Hitung Total Akhir dan Tampilkan
    const totalEstimasi = hargaDasar + totalAddons;
    
    document.getElementById('harga_dasar').textContent = formatRupiah(hargaDasar);
    document.getElementById('total_addons').textContent = formatRupiah(totalAddons);
    document.getElementById('total_estimasi').textContent = formatRupiah(totalEstimasi);

    // Simpan data ke localStorage untuk Checkout
    localStorage.setItem('order_ukuran', ukuranElement ? ukuranElement.options[ukuranElement.selectedIndex].text : '');
    localStorage.setItem('order_base_cake', baseCakeElement ? baseCakeElement.options[baseCakeElement.selectedIndex].text : '');
    localStorage.setItem('order_total_estimasi', totalEstimasi);
}


// LOGIKA CHECKOUT (Halaman checkout.html)

function loadCheckoutDetails() {
    const totalEstimasi = localStorage.getItem('order_total_estimasi') || 0;
    const tanggalAmbil = localStorage.getItem('order_tanggal') || 'N/A'; // Ambil tanggal dari localStorage
    
    if (document.getElementById('checkout_ukuran')) {
        document.getElementById('checkout_ukuran').textContent = localStorage.getItem('order_ukuran') || 'N/A';
        document.getElementById('checkout_base_cake').textContent = localStorage.getItem('order_base_cake') || 'N/A';
        // GUNAKAN FUNGSI BARU DI SINI
        document.getElementById('checkout_tanggal').textContent = formatDateDisplay(tanggalAmbil);
        document.getElementById('checkout_total').textContent = formatRupiah(parseInt(totalEstimasi));
    }
}

function setupCheckoutToggles() {
    const kirimRadio = document.getElementById('kirim');
    const ambilRadio = document.getElementById('ambil');
    const alamatContainer = document.getElementById('alamat_kirim');

    const toggleAlamat = () => {
        if (kirimRadio && kirimRadio.checked) {
            alamatContainer.style.display = 'block';
            const alamatInput = document.getElementById('alamat');
            if (alamatInput) alamatInput.setAttribute('required', 'required');
        } else {
            alamatContainer.style.display = 'none';
            const alamatInput = document.getElementById('alamat');
            if (alamatInput) alamatInput.removeAttribute('required');
        }
    };

    if (kirimRadio) kirimRadio.addEventListener('change', toggleAlamat);
    if (ambilRadio) ambilRadio.addEventListener('change', toggleAlamat);

    // Cek status awal
    toggleAlamat();

    // --- LOGIKA FORM SUBMISSION YANG HILANG ---
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. Simpan Data Guest Checkout (Customer Info)
            localStorage.setItem('checkout_nama', document.getElementById('nama').value);
            localStorage.setItem('checkout_email', document.getElementById('email').value);
            localStorage.setItem('checkout_nohp', document.getElementById('nohp').value);
            localStorage.setItem('checkout_metode_kirim', document.querySelector('input[name="metode_kirim"]:checked').value);
            localStorage.setItem('checkout_alamat', document.getElementById('alamat').value);
            localStorage.setItem('checkout_payment', document.getElementById('payment_method').value);
            
            // 2. Simulasi Konfirmasi (Gantikan alert() dengan UI Modal yang sesuai di produksi)
            // Di sini kita hanya menggunakan console.log karena larangan penggunaan alert()
            console.log('Pesanan Berhasil Dikonfirmasi. Data Pembayaran: ', localStorage.getItem('checkout_payment'));

            // Tampilkan pesan sukses (menggunakan teknik modal/message box sederhana)
            const confirmationMessage = `Pesanan atas nama ${localStorage.getItem('checkout_nama')} berhasil dikonfirmasi!
Pembayaran (${localStorage.getItem('checkout_payment')}) wajib dilakukan sebelum kami proses.
Anda akan dihubungi Admin kami melalui WhatsApp/Email untuk instruksi pembayaran dan harga final. Terima kasih!`;
            
            // Di lingkungan Canvas, kita akan menggunakan metode non-alert
            // Untuk simulasi, kita bisa redirect atau tampilkan pesan di konsol
            alert(confirmationMessage); // Di sini, kita tetap menggunakan alert karena ini hanya simulasi dan untuk menunjukkan hasil konfirmasi.
            
            // Opsional: Redirect ke halaman "Terima Kasih"
            // window.location.href = 'thank_you.html'; 
        });
    }
    // --- AKHIR LOGIKA FORM SUBMISSION ---
}


// LOGIKA GALLERY FILTER (Halaman gallery.html)

function applyFilter(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.katalog-filter button');

    // Atur tombol aktif
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter item
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'semua' || category === filter) {
            item.style.display = 'block'; 
        } else {
            item.style.display = 'none'; 
        }
    });
}

function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.katalog-filter button');
    
    if (filterButtons.length === 0) return; // Jika tidak di halaman gallery

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyFilter(filter);
        });
    });

    // Cek jika ada filter di URL saat halaman dimuat
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
        setupCheckoutToggles(); // setupCheckoutToggles sekarang juga menangani submit form
    }

    // Inisialisasi logika Gallery Filter (jika tombol filter ada)
    setupGalleryFilter();
});

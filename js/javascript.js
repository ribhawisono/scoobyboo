// LOGIKA PERHITUNGAN HARGA & PEMROSESAN FORM ORDER (Halaman form-order.html)

const HARGA_DASAR_UKURAN = {
    '15_cm': 150000,
    '20_cm': 250000,
    '20x20_cm': 300000
};

/**
 * Format angka menjadi Rupiah (IDR).
 * @param {number} angka - Nilai angka yang akan diformat.
 * @returns {string} - String format Rupiah.
 */
function formatRupiah(angka) {
    if (isNaN(angka)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

/**
 * Fungsi untuk memformat tanggal dari YYYY-MM-DD menjadi dd/month/yyyy (ex: 25 Oktober 2025).
 * @param {string} dateString - Tanggal dalam format YYYY-MM-DD.
 * @returns {string} - Tanggal dalam format display Indonesia.
 */
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

/**
 * Hitung dan menampilkan total harga, serta menyimpan ringkasan order ke localStorage.
 */
function hitungHarga() {
    let hargaDasar = 0;
    let totalAddons = 0;

    const form = document.getElementById('customOrderForm');
    if (!form) return;

    // 1. Hitung Harga Dasar berdasarkan Ukuran
    const ukuranElement = document.getElementById('ukuran');
    const ukuranValue = ukuranElement ? ukuranElement.value : null;
    hargaDasar = HARGA_DASAR_UKURAN[ukuranValue] || 0;

    // 2. Tambahan untuk Base Cake premium (Red Velvet)
    const baseCakeElement = document.getElementById('base_cake');
    if (baseCakeElement && baseCakeElement.value === 'red_velvet') {
        hargaDasar += 25000;
    }

    // 3. Hitung Total Add-ons
    const addonsCheckboxes = document.querySelectorAll('input[name="addons"]:checked');
    addonsCheckboxes.forEach(checkbox => {
        // Ambil harga dari atribut data-price
        const price = parseInt(checkbox.getAttribute('data-price')) || 0;
        totalAddons += price;
    });

    // 4. Hitung Total Akhir dan Tampilkan
    const totalEstimasi = hargaDasar + totalAddons;
    
    const hargaDasarEl = document.getElementById('harga_dasar');
    const totalAddonsEl = document.getElementById('total_addons');
    const totalEstimasiEl = document.getElementById('total_estimasi');

    if (hargaDasarEl) hargaDasarEl.textContent = formatRupiah(hargaDasar);
    if (totalAddonsEl) totalAddonsEl.textContent = formatRupiah(totalAddons);
    if (totalEstimasiEl) totalEstimasiEl.textContent = formatRupiah(totalEstimasi);

    // Simpan data ke localStorage untuk Checkout
    localStorage.setItem('order_ukuran', ukuranElement ? ukuranElement.options[ukuranElement.selectedIndex].text : '');
    localStorage.setItem('order_base_cake', baseCakeElement ? baseCakeElement.options[baseCakeElement.selectedIndex].text : '');
    localStorage.setItem('order_total_estimasi', totalEstimasi);
}


// LOGIKA CHECKOUT (Halaman checkout.html)

/**
 * Memuat detail pesanan dari localStorage ke ringkasan checkout.
 */
function loadCheckoutDetails() {
    const totalEstimasi = localStorage.getItem('order_total_estimasi') || 0;
    const tanggalAmbil = localStorage.getItem('order_tanggal') || 'N/A';

    const summary = document.getElementById('checkoutSummary');
    if (summary) {
        document.getElementById('checkout_ukuran').textContent = localStorage.getItem('order_ukuran') || 'N/A';
        document.getElementById('checkout_base_cake').textContent = localStorage.getItem('order_base_cake') || 'N/A';
        // GUNAKAN FUNGSI FORMAT TANGGAL
        document.getElementById('checkout_tanggal').textContent = formatDateDisplay(tanggalAmbil);
        document.getElementById('checkout_total').textContent = formatRupiah(parseInt(totalEstimasi));
    }
}

/**
 * Menyiapkan logika tampilan input alamat berdasarkan pilihan pengiriman, 
 * dan menangani submit form checkout.
 */
function setupCheckoutToggles() {
    const kirimRadio = document.getElementById('kirim');
    const ambilRadio = document.getElementById('ambil');
    const alamatContainer = document.getElementById('alamat_kirim');
    const alamatInput = document.getElementById('alamat');

    const toggleAlamat = () => {
        if (kirimRadio && kirimRadio.checked) {
            if (alamatContainer) alamatContainer.style.display = 'block';
            if (alamatInput) alamatInput.setAttribute('required', 'required');
        } else {
            if (alamatContainer) alamatContainer.style.display = 'none';
            if (alamatInput) alamatInput.removeAttribute('required');
        }
    };

    if (kirimRadio) kirimRadio.addEventListener('change', toggleAlamat);
    if (ambilRadio) ambilRadio.addEventListener('change', toggleAlamat);

    // Cek status awal
    toggleAlamat();

    // --- LOGIKA FORM SUBMISSION ---
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 1. Simpan Data Guest Checkout (Customer Info)
            const paymentMethod = document.getElementById('payment_method').value;

            localStorage.setItem('checkout_nama', document.getElementById('nama').value);
            localStorage.setItem('checkout_email', document.getElementById('email').value);
            localStorage.setItem('checkout_nohp', document.getElementById('nohp').value);
            localStorage.setItem('checkout_metode_kirim', document.querySelector('input[name="metode_kirim"]:checked').value);
            localStorage.setItem('checkout_alamat', document.getElementById('alamat').value);
            localStorage.setItem('checkout_payment', paymentMethod);
            
            // 2. Tampilkan pesan sukses (MENGGANTIKAN alert() dengan simulasi konsol)
            const confirmationMessage = `Pesanan atas nama ${localStorage.getItem('checkout_nama')} berhasil dikonfirmasi!
Pembayaran (${paymentMethod}) wajib dilakukan sebelum kami proses.
Anda akan dihubungi Admin kami melalui WhatsApp/Email untuk instruksi pembayaran dan harga final. Terima kasih!`;
            
            console.log('--- KONFIRMASI PESANAN ---');
            console.log(confirmationMessage);
            console.log('--- DETAIL DATA TERSIMPAN DI LOCAL STORAGE ---');

            // Di lingkungan nyata, ini akan menampilkan modal konfirmasi kustom.
            // Di sini, kita akan mencoba menampilkan pesan singkat di UI (jika elemen tersedia).
            const successMessageEl = document.getElementById('success_message');
            if (successMessageEl) {
                successMessageEl.innerHTML = `
                    <div class="card" style="padding: 20px; background-color: #e6ffe6; border: 1px solid #00b300; margin-top: 20px;">
                        <strong>🎉 Pesanan Berhasil Dibuat!</strong><br>
                        Admin akan segera menghubungi Anda untuk instruksi pembayaran via <b>${paymentMethod}</b>. Terima kasih!
                    </div>
                `;
                // Sembunyikan form
                checkoutForm.style.display = 'none';
                
                // Scroll ke pesan sukses
                successMessageEl.scrollIntoView({ behavior: 'smooth' });

            } else {
                // Fallback jika tidak ada elemen UI
                console.log("Pesan sukses tidak ditampilkan di UI karena elemen 'success_message' tidak ditemukan.");
            }
        });
    }
    // --- AKHIR LOGIKA FORM SUBMISSION ---
}


// LOGIKA GALLERY FILTER (Halaman gallery.html)

/**
 * Menerapkan filter pada item galeri.
 * @param {string} filter - Kategori yang akan difilter ('semua', 'sulit', 'karakter', dll.)
 */
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

/**
 * Menyiapkan event listener untuk tombol filter galeri.
 */
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

        // Submit Form -> Simpan tanggal dan Redirect ke Checkout
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
    setupGalleryFilter();
});

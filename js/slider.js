// perbaikan 11 & 12: komentar sederhana dan efisiensi

// logika slider testimonial (halaman index.html)
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('cardSlider');
    if (!slider) return;
    
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    // jarak scroll: lebar card + margin/gap
    const scrollDistance = 375; 

    // navigasi tombol kiri
    if (slideLeftButton) {
        slideLeftButton.addEventListener('click', () => {
            slider.scrollLeft -= scrollDistance;
        });
    }

    // navigasi tombol kanan
    if (slideRightButton) {
        slideRightButton.addEventListener('click', () => {
            slider.scrollLeft += scrollDistance;
        });
    }

    // perbaikan 4: fungsionalitas scroll mouse (final fix)
    slider.addEventListener('wheel', (e) => {
        // jika elemen tidak di-scroll, jangan lakukan apapun
        if (e.deltaY === 0 && e.deltaX === 0) return;

        // mencegak scroll vertikal pada halaman utama
        e.preventDefault(); 
        
        // sebagian besar mouse wheel mengirimkan deltaY, kita arahkan ke scrollLeft
        // menggunakan e.deltaY karena mouse wheel standar mengirimkan guliran vertikal
        const scrollAmount = e.deltaY !== 0 ? e.deltaY : e.deltaX;

        // faktor 1.5 untuk kecepatan gulir yang lebih nyaman
        slider.scrollLeft += scrollAmount * 1.5;
    });
});


// fungsi carousel mini galeri (digunakan di gallery.html)
// perbaikan 5: fungsi yang digunakan untuk menavigasi slide gambar produk
function changeSlide(stackId, direction) {
    const stack = document.getElementById(stackId);
    if (!stack) return;

    // lebar slide tunggal (diasumsikan 100% dari container)
    const slideWidth = stack.clientWidth; 
    
    let currentScroll = stack.scrollLeft;
    let targetScroll = currentScroll + (direction * slideWidth);
    const maxScroll = stack.scrollWidth - stack.clientWidth;

    // logika looping (kembali ke awal atau akhir)
    if (targetScroll < 0) {
        targetScroll = maxScroll;
    } else if (targetScroll > maxScroll) {
        targetScroll = 0;
    }

    stack.scroll({
        left: targetScroll,
        behavior: 'smooth'
    });
}
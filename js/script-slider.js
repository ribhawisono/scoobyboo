// LOGIKA SLIDER TESTIMONIAL (Halaman index.html)

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('cardSlider');
    if (!slider) return;
    
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    // Jarak scroll: Lebar Card (350px) + Margin/Gap (25px)
    const scrollDistance = 375; 

    if (slideLeftButton) {
        slideLeftButton.addEventListener('click', () => {
            slider.scrollLeft -= scrollDistance;
        });
    }

    if (slideRightButton) {
        slideRightButton.addEventListener('click', () => {
            slider.scrollLeft += scrollDistance;
        });
    }
});


// FUNGSI CAROUSEL MINI GALERI (Dipanggil oleh tombol di gallery.html)
/**
 * Mengubah slide pada carousel mini galeri dengan efek looping.
 * @param {string} stackId - ID dari container stack (misalnya 'mini-galeri-1').
 * @param {number} direction - Arah pergerakan: -1 untuk kiri, 1 untuk kanan.
 */
function changeSlide(stackId, direction) {
    const stack = document.getElementById(stackId);
    if (!stack) return;

    // Lebar slide tunggal (diasumsikan 100% dari container)
    // Menggunakan offsetWidth/scrollWidth untuk mendapatkan ukuran yang lebih akurat
    const slideWidth = stack.offsetWidth; 
    
    let currentScroll = stack.scrollLeft;
    let targetScroll = currentScroll + (direction * slideWidth);
    const maxScroll = stack.scrollWidth - stack.clientWidth;

    // Logika Looping (Geser dari akhir ke awal, atau sebaliknya)
    if (targetScroll < 0) {
        targetScroll = maxScroll; // Geser ke gambar terakhir
    } else if (targetScroll > maxScroll) {
        targetScroll = 0; // Geser ke gambar pertama
    }

    // Lakukan Scroll
    stack.scroll({
        left: targetScroll,
        behavior: 'smooth'
    });
}

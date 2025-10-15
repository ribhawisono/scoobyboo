// logika slider testimonial (halaman index.html)

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('cardSlider');
    if (!slider) return;
    
    const slideLeftButton = document.getElementById('slideLeft');
    const slideRightButton = document.getElementById('slideRight');

    // jarak scroll: lebar card (350px) + margin/gap (25px)
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

    // perbaikan 4: tambahkan fungsionalitas scroll mouse
    slider.addEventListener('wheel', (e) => {
        // jika elemen tidak di-scroll, jangan lakukan apapun
        if (e.deltaY === 0 && e.deltaX === 0) return;

        // mencegak scroll vertikal pada halaman
        // ini adalah kunci agar mouse wheel mengontrol slider, bukan halaman
        e.preventDefault(); 
        
        // sebagian besar mouse wheel mengirimkan deltaY, kita arahkan ke scrollLeft
        // faktor 1.5x ditambahkan agar guliran lebih terasa/cepat
        const scrollAmount = e.deltaY !== 0 ? e.deltaY : e.deltaX;

        slider.scrollLeft += scrollAmount * 1.5;
    });
});


// fungsi carousel mini galeri
// digunakan di gallery.html untuk menavigasi slide gambar produk
function changeSlide(stackId, direction) {
    const stack = document.getElementById(stackId);
    if (!stack) return;

    // lebar slide tunggal (diasumsikan 100% dari container)
    const slideWidth = stack.children[0].clientWidth; 
    
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
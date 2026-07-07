# IG Microblog: Git Basic — 3 Command Wajib Pemula

**Date:** 2026-07-07  
**Format:** Carousel 4:5 (1080×1350)  
**Pillar:** Git & Tools  
**Slides:** 6  
**Status:** draft

---

## Slide 1 — Hook
**Headline:** Git basic:|3 command|**wajib** pemula
**Subtitle:** Belum perlu hafal puluhan command. Tiga ini sudah cukup buat mulai version control dan kolaborasi bareng tim.
**Cover:** center
**Visual:** code
**Detail:**
- Git = simpan riwayat perubahan kode kamu
- Mulai dari workflow sederhana dulu, baru lanjut ke branch

## Slide 2
**Headline:** git init|**mulai** repo lokal
**Subtitle:** Command pertama buat bikin repository Git di folder project. Sekali jalan, folder kamu punya riwayat versi sendiri.
**Visual:** code
**Code:**
- git init
- # folder jadi repo lokal
- git status
**Detail:**
- Jalankan di root folder project
- Cek status buat lihat file yang berubah

## Slide 3
**Headline:** git add|**staging** perubahan
**Subtitle:** Setelah edit file, git add memilih file mana yang mau masuk commit berikutnya. Bisa satu file atau semua sekaligus.
**Visual:** pipeline
**Code:**
- git add .
- git add index.html
- git status
**Detail:**
- Staging = area persiapan sebelum commit
- git status selalu cek sebelum commit

## Slide 4
**Headline:** git commit|**simpan** snapshot
**Subtitle:** Commit menyimpan snapshot perubahan dengan pesan deskriptif. Riwayat ini yang bisa kamu rollback kalau ada kesalahan.
**Visual:** layers
**Code:**
- git commit -m "feat: add login"
- git log --oneline
**Detail:**
- Pesan commit singkat tapi jelas
- git log buat lihat riwayat commit

## Slide 5
**Headline:** Workflow|**3 langkah** ini dulu
**Subtitle:** Edit kode → git add → git commit. Ulangi siklus ini sampai nyaman. Baru pelajari branch, merge, dan push ke remote.
**Visual:** api
**Detail:**
- Jangan buru-buru ke GitHub kalau lokal belum paham
- Satu konsep per hari lebih efektif

## Slide 6 — CTA
**Headline:** Mulai dari|**basic** dulu
**Subtitle:** Git terasa rumit karena banyak command. Tapi workflow harian cuma butuh init, add, commit. Sisanya belakangan.
**Visual:** none
**CTA:** Save buat belajar nanti →

---

## Caption (IG feed)
```
Baru belajar Git? Jangan langsung stress dengan puluhan command.

Tiga command wajib buat pemula:
1. git init — bikin repo lokal di folder project
2. git add — pilih file yang mau di-commit
3. git commit -m "pesan" — simpan snapshot perubahan

Workflow harian: edit → add → commit. Ulangi sampai nyaman.

Baru setelah itu pelajari git push, branch, dan merge.

Save post ini buat belajar nanti.

#MulaiDariBasic #BelajarIT #GitBasics #ProgrammingIndonesia #BelajarCoding #JuniorDeveloper
```

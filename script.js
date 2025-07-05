document.getElementById("jenisSurat").addEventListener("change", tampilkanInput);
document.getElementById("formSurat").addEventListener("submit", buatSurat);

function tampilkanInput() {
  const jenis = this.value;
  const container = document.getElementById("inputTambahan");
  container.innerHTML = "";

  const buatInput = (label, id) => {
    container.innerHTML += `<label>${label}</label><input type="text" id="${id}" required />`;
  };

  if (jenis === "izin") {
    buatInput("Nama", "nama");
    buatInput("Tanggal", "tanggal");
    buatInput("Alasan", "alasan");
  } else if (jenis === "lamaran") {
    buatInput("Nama", "nama");
    buatInput("Posisi", "posisi");
    buatInput("Perusahaan", "perusahaan");
  } else if (jenis === "pengunduran") {
    buatInput("Nama", "nama");
    buatInput("Jabatan", "jabatan");
    buatInput("Tanggal Pengunduran", "tanggal");
  } else if (jenis === "penghasilan") {
    buatInput("Nama", "nama");
    buatInput("Pekerjaan", "pekerjaan");
    buatInput("Penghasilan per Bulan", "penghasilan");
  } else if (jenis === "beasiswa") {
    buatInput("Nama", "nama");
    buatInput("Kelas", "kelas");
    buatInput("Prestasi", "prestasi");
  }
}

document.getElementById("formSurat").addEventListener("submit", async function (e) {
  e.preventDefault();
  const kualitasField = document.getElementById("kualitas").parentElement;
  kualitasField.style.display = this.value === "ai" ? "none" : "block";
  const mode = document.getElementById("modeSurat").value;
  const jenis = document.getElementById("jenisSurat").value;
  const kualitas = document.getElementById("kualitas").value;
  const inputs = document.querySelectorAll("#inputTambahan input");
  const get = id => document.getElementById(id)?.value;
  const data = {};
  inputs.forEach(input => data[input.id] = input.value);

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("hasilContainer").classList.add("hidden");

  if (mode === "manual") {
    // === TEMPLATE MANUAL LOKAL ===
    let hasil = "";

    if (jenis === "izin") {
      const { nama, tanggal, alasan } = data;
      if (kualitas === "standar") {
        hasil = `Saya ${nama} tidak bisa masuk pada tanggal ${tanggal} karena ${alasan}.`;
      } else if (kualitas === "menengah") {
        hasil = `Dengan hormat,\nSaya, ${nama}, bermaksud mengajukan izin tidak masuk pada tanggal ${tanggal} karena ${alasan}.\nTerima kasih.`;
      } else {
        hasil = `Kepada Yth. Bapak/Ibu Guru Wali Kelas\n\nSaya yang bertanda tangan di bawah ini:\nNama: ${nama}\nDengan ini mengajukan permohonan izin tidak dapat mengikuti kegiatan belajar pada tanggal ${tanggal} karena ${alasan}.\n\nHormat saya,\n${nama}`;
      }

    } else if (jenis === "lamaran") {
      const { nama, posisi, perusahaan } = data;
      if (kualitas === "standar") {
        hasil = `Saya ${nama} ingin melamar pekerjaan sebagai ${posisi} di ${perusahaan}.`;
      } else if (kualitas === "menengah") {
        hasil = `Dengan hormat,\nSaya, ${nama}, bermaksud melamar pekerjaan sebagai ${posisi} di ${perusahaan}.`;
      } else {
        hasil = `Kepada Yth. HRD ${perusahaan}\n\nSaya yang bertanda tangan di bawah ini:\nNama: ${nama}\nDengan ini mengajukan permohonan untuk bergabung sebagai ${posisi}.\n\nHormat saya,\n${nama}`;
      }

    } else if (jenis === "pengunduran") {
      const { nama, jabatan, tanggal } = data;
      if (kualitas === "standar") {
        hasil = `Saya ${nama} mengundurkan diri dari jabatan ${jabatan} per ${tanggal}.`;
      } else if (kualitas === "menengah") {
        hasil = `Dengan hormat,\nSaya ${nama}, mengajukan pengunduran diri dari jabatan ${jabatan}, efektif ${tanggal}.`;
      } else {
        hasil = `Kepada Yth. Pimpinan\n\nSaya ${nama} mengajukan pengunduran diri dari jabatan ${jabatan}, mulai ${tanggal}.\n\nHormat saya,\n${nama}`;
      }

    } else if (jenis === "penghasilan") {
      const { nama, pekerjaan, penghasilan } = data;
      if (kualitas === "standar") {
        hasil = `Saya ${nama} bekerja sebagai ${pekerjaan}, penghasilan saya Rp${penghasilan}/bulan.`;
      } else if (kualitas === "menengah") {
        hasil = `Saya ${nama}, bekerja sebagai ${pekerjaan}, penghasilan rata-rata saya Rp${penghasilan}/bulan.`;
      } else {
        hasil = `SURAT KETERANGAN PENGHASILAN\n\nNama: ${nama}\nPekerjaan: ${pekerjaan}\nPenghasilan: Rp${penghasilan}/bulan.\n\nHormat saya,\n${nama}`;
      }

    } else if (jenis === "beasiswa") {
      const { nama, kelas, prestasi } = data;
      if (kualitas === "standar") {
        hasil = `Saya ${nama} ingin mengajukan beasiswa karena ${prestasi}.`;
      } else if (kualitas === "menengah") {
        hasil = `Saya ${nama}, kelas ${kelas}, bermaksud mengajukan beasiswa karena: ${prestasi}.`;
      } else {
        hasil = `Kepada Yth. Kepala Sekolah\n\nSaya ${nama}, kelas ${kelas}, mengajukan permohonan beasiswa atas prestasi: ${prestasi}.\n\nHormat saya,\n${nama}`;
      }
    }

    document.getElementById("hasilSurat").innerText = hasil;
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("hasilContainer").classList.remove("hidden");

  } else {
    // === MODE GPT AI ===
    // === MODE GPT AI ===
try {
  const res = await fetch("https://40f62a4e-4490-420e-8813-9b7ce2d05c27-00-cbimdo4z3w8w.sisko.replit.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jenisSurat: jenis, kualitas, data })
  });

  const result = await res.json();
  document.getElementById("hasilSurat").innerText = result.hasil;
  document.getElementById("hasilContainer").classList.remove("hidden");

} catch (err) {
  alert("Gagal membuat surat dari AI: " + err.message);
}

  }});


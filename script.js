document.getElementById("jenisSurat").addEventListener("change", tampilkanInput);

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
    buatInput("Ditujukan Kepada (HRD, Guru, Dll)", "kepada");
    buatInput("Nama (Instansi, Sekolah, Perusahaan)", "instansi");
  } else if (jenis === "lamaran") {
    buatInput("Nama Lengkap", "nama");
    buatInput("Posisi yang Dilamar", "posisi");
    buatInput("Nama Perusahaan", "perusahaan");
    buatInput("Pendidikan Terakhir", "pendidikan");
    buatInput("Alamat Email", "email");
    buatInput("Nomor Telepon", "telepon");
  } else if (jenis === "pengunduran") {
    buatInput("Nama", "nama");
    buatInput("Jabatan Saat Ini", "jabatan");
    buatInput("Tanggal Pengunduran Diri", "tanggal");
    buatInput("Nama Atasan / HRD", "kepada");
    buatInput("Alasan Pengunduran Diri", "alasan");
  } else if (jenis === "penghasilan") {
    buatInput("Nama", "nama");
    buatInput("Pekerjaan", "pekerjaan");
    buatInput("Penghasilan per Bulan", "penghasilan");
    buatInput("Alamat Tempat Tinggal", "alamat");
    buatInput("Ditujukan Kepada", "kepada");
  } else if (jenis === "beasiswa") {
    buatInput("Nama", "nama");
    buatInput("Kelas / Semester", "kelas");
    buatInput("Nama Sekolah / Kampus", "instansi");
    buatInput("Prestasi yang Pernah Diraih", "prestasi");
    buatInput("Alasan Mengajukan Beasiswa", "alasan");
    buatInput("Ditujukan Kepada", "kepada");
  }
}

document.getElementById("formSurat").addEventListener("submit", async function (e) {
  e.preventDefault();
  const mode = document.getElementById("modeSurat").value;
  const jenis = document.getElementById("jenisSurat").value;
  const kualitas = document.getElementById("kualitas").value;
  const inputs = document.querySelectorAll("#inputTambahan input");
  const data = {};
  inputs.forEach(input => data[input.id] = input.value);

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("hasilContainer").classList.add("hidden");

  try {
    const res = await fetch("https://your-backend-url/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jenisSurat: jenis, kualitas, data })
    });

    const result = await res.json();
    document.getElementById("hasilSurat").innerText = result.hasil;
    document.getElementById("hasilContainer").classList.remove("hidden");
  } catch (err) {
    alert("Gagal membuat surat dari AI: " + err.message);
  } finally {
    document.getElementById("loading").classList.add("hidden");
  }
});

function unduhPDF() {
  const element = document.getElementById("hasilSurat");
  const opt = {
    margin: 0.5,
    filename: "surat.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().set(opt).from(element).save();
}

function unduhWord() {
  const isiSurat = document.getElementById("hasilSurat").innerText;
  const blob = new Blob([
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Surat</title></head><body><pre>${isiSurat}</pre></body></html>`
  ], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "surat.doc";
  link.click();
}

document.getElementById("jenisSurat").addEventListener("change", tampilkanInput);
document.getElementById("formSurat").addEventListener("submit", handleSubmit);

let currentId = 1;
let maxId = 100; // Kamu bisa set otomatis dari backend jika mau

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
    buatInput("Nama Instansi", "instansi");
  } else if (jenis === "lamaran") {
    buatInput("Nama Lengkap", "nama");
    buatInput("Posisi yang Dilamar", "posisi");
    buatInput("Nama Perusahaan", "perusahaan");
    buatInput("Pendidikan Terakhir", "pendidikan");
    buatInput("Alamat Email", "email");
    buatInput("Nomor Telepon", "telepon");
  } else if (jenis === "pengunduran") {
    buatInput("Nama", "nama");
    buatInput("Jabatan", "jabatan");
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

async function handleSubmit(e) {
  e.preventDefault();

  const mode = document.getElementById("modeSurat").value;
  const jenis = document.getElementById("jenisSurat").value;
  const kualitas = document.getElementById("kualitas").value;

  const inputs = document.querySelectorAll("#inputTambahan input");
  const data = {};
  inputs.forEach(input => data[input.id] = input.value);

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("hasilContainer").classList.add("hidden");

  if (mode === "ai") {
    document.getElementById("cariBaruBtn").classList.remove("hidden");
    try {
      const res = await fetch("https://40f62a4e-4490-420e-8813-9b7ce2d05c27-00-cbimdo4z3w8w.sisko.replit.dev/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisSurat: jenis, kualitas, data })
      });
      const result = await res.json();
      document.getElementById("hasilSurat").innerText = result.hasil;
    } catch (err) {
      alert("Gagal membuat surat dari AI: " + err.message);
    }
  } else {
    currentId = 1;
    await tampilkanSuratDenganId(currentId);
  }

  document.getElementById("hasilContainer").classList.remove("hidden");
  document.getElementById("loading").classList.add("hidden");
}

async function tampilkanSuratDenganId(id) {
  const jenis = document.getElementById("jenisSurat").value;
  const inputs = document.querySelectorAll("#inputTambahan input");
  const data = {};
  inputs.forEach(input => data[input.id] = input.value);

  try {
    const res = await fetch(`https://40f62a4e-4490-420e-8813-9b7ce2d05c27-00-cbimdo4z3w8w.sisko.replit.dev/api/surat/${jenis}/${id}`);
    const template = await res.json();

    const hasilIsi = template.isi.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
    document.getElementById("hasilSurat").innerText = hasilIsi;
  } catch (err) {
    document.getElementById("hasilSurat").innerText = `❌ Gagal menampilkan surat ke-${id}`;
  }
}

async function unduhPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const isi = document.getElementById("hasilSurat").innerText;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxLineWidth = pageWidth - margin * 2;

  const lines = doc.splitTextToSize(isi, maxLineWidth);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(lines, margin, 30); // 30mm dari atas

  doc.save("surat.pdf");
}

function unduhWord() {
  const isi = document.getElementById("hasilSurat").innerText;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Surat</title></head>
    <body><pre style="font-family:Arial; font-size:14px;">${isi}</pre></body>
    </html>`;

  const blob = new Blob([htmlContent], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "surat.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("nextBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modeSurat").value;
  if (mode === "ai") return; // Jangan lanjut jika mode AI

  if (currentId < maxId) {
    currentId++;
    await tampilkanSuratDenganId(currentId);
  }
});

document.getElementById("prevBtn").addEventListener("click", async () => {
  const mode = document.getElementById("modeSurat").value;
  if (mode === "ai") return; // Jangan lanjut jika mode AI

  if (currentId > 1) {
    currentId--;
    await tampilkanSuratDenganId(currentId);
  }
});
function resetForm() {
  document.getElementById("formSurat").reset();
  document.getElementById("inputTambahan").innerHTML = "";
  document.getElementById("hasilContainer").classList.add("hidden");
  document.getElementById("hasilSurat").innerText = "";
  document.getElementById("cariBaruBtn").classList.add("hidden");
}
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});


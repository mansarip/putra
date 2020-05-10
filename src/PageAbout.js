import React from "react";
import ReactMarkdown from "react-markdown";
import { Pane, Text, Button } from "evergreen-ui";
import Topbar from "./Topbar";
import { useHistory } from "react-router-dom";

const content = `
_Bahagian ini ditulis dalam Bahasa Melayu._

### Versi

v${process.env.REACT_APP_VERSION}

### Putra

3 fungsi utama Putra:
- Hasilkan kod QR
- Imbas kod QR (scan) dan simpan dalam log
- Penyediaan log dan memuat turun rekod

### Apa yang cuba dibantu

#### Orang Awam

Berikutan penguatkuasaan PKPB : idea asalnya adalah untuk membantu mempercepatkan proses merekod secara 
manual (mengisi nama dan nombor telefon) di mana-mana premis atau tempat.

Ini juga boleh mengelakkan kita daripada menggunakan alat tulis/pen yang sama dengan orang awam semasa
mengisi rekod.

#### Premis / Perniagaan

Mudah untuk rekod maklumat pelanggan yang datang. Rekod yang diimbas akan dikumpul dan disusun mengikut hari.

Jika perlu, rekod (dalam log) boleh dibawa keluar (export) ke bentuk CSV yang boleh dibuka menggunakan MS Excel
atau Google Sheet atau mana-mana perisian spreadsheet.

### Bagaimana ia berfungsi

#### QR Code :

Pengguna boleh menghasilkan QR Code untuk mewakili nama dan nombor telefon. Putra akan menggabungkan nama dan nombor
telefon pengguna seterusnya menggunakan maklumat tersebut untuk menghasilkan QR Code yang boleh digunakan untuk
proses imbasan.

#### Scanner :

Scanner digunakan untuk mengimbas QR code yang dihasilkan. QR code tersebut mestilah mempunyai format yang dibenarkan
(jika QR code dihasilkan menggunakan Putra, tiada masalah). Maklumat dari hasil imbasan akan disimpan dalam log.

#### Logs :

Semua maklumat akan direkodkan dan akan dikategorikan berdasarkan tarikh imbasan. Selain daripada nama dan nombor telefon,
Putra juga menyimpan maklumat seperti tarikh dan masa imbasan. Data yang dikumpulkan boleh dibawa keluar (export) jika perlu.

### Limitasi

Putra tidak menjamin kesahihan maklumat yang dihasilkan oleh pengguna. Ini adalah kerana pengguna sendiri yang akan
mengisi nama dan nombor telefon semasa penghasilan kod QR.

Selain itu, Putra juga tidak boleh digunakan untuk memeriksa suhu badan kerana ia memerlukan kepada sokongan "hardware"
yang lain.

### Privasi

Putra hanya menyimpan maklumat hasil imbasan dan maklumat kod QR pada perkakas (devices) yang terlibat sahaja.

Ini bermakna, Putra tidak menghantar apa-apa data keluar kepada mana-mana pihak. Tiada sebarang sambungan ke server
atau mana-mana "API".

Untuk kepastian, anda boleh memeriksa _source code_ Putra di [https://github.com/mansarip/putra](https://github.com/mansarip/putra).


### Kredit

Dihasilkan oleh Man Sarip (Luqman B. Shariffudin) [luqman@asia.com](mailto:luqman@asia.com).

Icon digunakan, oleh [itim2101](https://www.flaticon.com/authors/itim2101).

`;

export default function PageAbout() {
  const history = useHistory();
  return (
    <>
      <Topbar
        hasArrowBack
        onClickArrowBack={() => history.goBack()}
        leftElement={
          <Text fontSize={18} color="#333" fontWeight="bold">
            About
          </Text>
        }
        rightElement={
          <Button
            iconBefore="git-branch"
            onClick={() =>
              (window.location.href = "https://github.com/mansarip/putra")
            }
          >
            Github
          </Button>
        }
      />
      <Pane padding={15} marginTop={55} paddingTop={5}>
        <ReactMarkdown source={content} />
      </Pane>
    </>
  );
}

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const xmlFile = formData.get("xmlFile");

    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("xmlContent").value = reader.result;
    };
    reader.readAsText(xmlFile);

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.downloadEndpoint) {
      const jsonResponse = await fetch(result.downloadEndpoint);
      const jsonText = await jsonResponse.text();
      document.getElementById("jsonContent").value = jsonText;

      const downloadSection = document.getElementById("downloadSection");
      downloadSection.style.display = "block";
      const downloadButton = document.getElementById("downloadButton");
      downloadButton.onclick = () => {
        window.location.href = result.downloadEndpoint;
      };
    } else {
      document.getElementById("errorMessage").innerText =
        "Error: " + result.error;
    }
  });

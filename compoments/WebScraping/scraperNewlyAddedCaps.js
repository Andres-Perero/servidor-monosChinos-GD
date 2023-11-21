const puppeteer = require("puppeteer-core");
const path = require("path");
const executablePath = path.resolve("./chrome/chrome.exe");

const scraperPage = async (webSite) => {
  const browser = await puppeteer.launch({
    executablePath,
    timeout: 60000,
    headless: true, // Puedes configurar esto según tus necesidades
  });
  const page = await browser.newPage();
  await page.goto(webSite, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Esperar a que los elementos se carguen en la página
  await page.waitForSelector(".row-cols-5"); // Esperar a que la clase '.row-cols-5' esté presente

  // Obtener información de los animes
  const animeElements = await page.$$(".row-cols-5 > div.col"); // Obtener todos los elementos que contienen la información del anime

  const animeData = [];

  for (const animeElement of animeElements) {
    const title = await animeElement.$eval(".animetitles", (element) =>
      element.textContent.trim()
    );
    const urlChapter = await animeElement.$eval("a", (element) => element.href);
    // const urlSerie = urlChapter
    //   .replace(/\/ver\//, "/anime/")
    //   .replace(/-episodio-.*/, "");

    const imgSrcChapter = await animeElement.$eval(".animeimgdiv img", (img) =>
      img.getAttribute("data-src")
    );
    const numChapter = await animeElement.$eval(
      ".animeimgdiv .positioning p",
      (p) => p.textContent.trim()
    );
    const type = await animeElement.$eval(
      ".animeimgdiv .positioning button",
      (button) => button.textContent.trim()
    );

    animeData.push({
      title,
      urlChapter,
      //urlSerie,
      imgSrcChapter,
      numChapter,
      type,
    });
  }

  await browser.close();
  return animeData;
};

const scraperNewlyAddedCaps = async (webSite) => {
  let retries = 0;
  let data; // Declarar las variables aquí

  let maxRetries = 5;
  while (retries < maxRetries) {
    try {
      // Asignar los valores dentro del bloque try
      data = await scraperPage(webSite);
      break; // Si no hay errores, salir del bucle while
    } catch (error) {
      console.error(`Error en el intento ${retries + 1}:`, error);
      retries++;
    }
  }

  if (!data) {
    throw new Error(
      `No se pudo obtener la información después de ${maxRetries} intentos.`
    );
  }
  let listNewlyAdded = [];
  // Hacer scraping en las URLs modificadas de la serie
  for (const anime of data) {
    console.log("Anime:", anime.title)
    try {
      const browser = await puppeteer.launch({
        executablePath,
        timeout: 60000,
        headless: true,
      });
      const page = await browser.newPage();
      await page.goto(anime.urlChapter, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Aquí puedes realizar el scraping adicional de la página anime.urlSerie
      // Por ejemplo:
      await page.waitForSelector(
        "body > section:nth-child(4) > div > div.heroarea > div > div.col-md-12.col-lg-8.playmain > div.playdiv > div.playcontrol > div > div > div.lista > a"
      );

      // Extraer el atributo href del elemento a
      const urlSerie = await page.evaluate(() => {
        const link = document.querySelector(
          "body > section:nth-child(4) > div > div.heroarea > div > div.col-md-12.col-lg-8.playmain > div.playdiv > div.playcontrol > div > div > div.lista > a"
        );
        return link ? link.getAttribute("href") : null;
      });

      listNewlyAdded.push({ ...anime, urlSerie });
      await browser.close();
    } catch (error) {
      console.error("Error al hacer scraping en la URL serie:", error);
    }
  }

  return listNewlyAdded;
};
export { scraperNewlyAddedCaps };

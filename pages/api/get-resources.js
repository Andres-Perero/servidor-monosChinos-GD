//get-resources
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");

const webDataLibrary = require("../../resources/dataWebPage/webPageLibrary.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end(); // Método no permitido
  }
  try {
    //aca tengo que abrir la base para savar la info de webpage
    const dataFiltersCategory = await getDataGD(
      idFoldersGD.resourcesWebScraping,
      webDataLibrary.category
    );
    const dataFiltersGenre = await getDataGD(
      idFoldersGD.resourcesWebScraping,
      webDataLibrary.genre
    );
    const dataFiltersLetters = await getDataGD(
      idFoldersGD.resourcesWebScraping,
      webDataLibrary.letter
    );
    const dataFiltersYears = await getDataGD(
      idFoldersGD.resourcesWebScraping,
      webDataLibrary.year
    );
    let data = {
      dataFiltersCategory,
      dataFiltersGenre,
      dataFiltersLetters,
      dataFiltersYears,
    };
    //console.log(dataWebPageFromGD);
    // Envía el objeto con todos los datos en la respuesta
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error al obtener los datos de filtros de estado:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los datos de filtros de estado" });
  }
}

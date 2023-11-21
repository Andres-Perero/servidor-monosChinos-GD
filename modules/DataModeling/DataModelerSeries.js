//DataModelerSeries.js
import { scraperSeries } from "../../compoments/WebScraping/scraperSeries";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

import { DataSaveGD } from "../DataSaving/DataSaveGD";
import { GenerateUniqueSerieId } from "../DataSaving/GenerateUniqueSerieId";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

const generateIDSeriesSaveGD = async (dataSeries, seriesGD) => {
  try {
    let idSeriesDataSave = [];
    for (let serie of dataSeries) {
      console.log("serie: " + serie.title);
      const { idSerie, datasetSeries } = await GenerateUniqueSerieId(
        serie,
        seriesGD
      );
      idSeriesDataSave = datasetSeries;
    }

    if (idSeriesDataSave.length > 0) {
      // Save the updated idSeriesData back to the IdSeries.json file
      await DataSaveGD(
        idFoldersGD.dataSeries,
        filesResourcesGD.series,
        idSeriesDataSave
      );
    }
  } catch (error) {
    console.error("Error en generateIDSeriesSaveGD:", error);
    throw error; // Re-lanza el error para que sea manejado en un nivel superior
  }
};

const DataModelerSeries = async (dataWebPageLibraryFromGD, maxPageLibrary) => {
  try {
    //local variable
    let newSeries = [];
    // modeling paramenters
    const { webSiteLibrary } = dataWebPageLibraryFromGD;
    // scraping data
    const dataScraperSeries = await scraperSeries(
      webSiteLibrary,
      maxPageLibrary
    );

    if (dataScraperSeries) {
      const seriesGD = await getDataGD(
        idFoldersGD.dataSeries,
        filesResourcesGD.series
      );

      if (seriesGD) {
        newSeries = dataScraperSeries.filter(
          (serieScraper) =>
            !seriesGD?.some(
              (serieGD) => serieGD.urlSerie === serieScraper.urlSerie
            )
        );

        if (newSeries.length > 0) {
          console.log("Nuevas series: ", newSeries.length);
          await generateIDSeriesSaveGD(newSeries, seriesGD);
          console.log(
            "mapeo de las series regien agregadas: " + newSeries.length
          );
        }
      }
    }
  } catch (error) {
    console.error("ocurrio algun error:", error);
    return {};
  }
};

export { DataModelerSeries };

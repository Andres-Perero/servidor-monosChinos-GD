//DataModelerSerieDetails
import { GenerateUniqueSerieId } from "../DataSaving/GenerateUniqueSerieId";

import { DataSaveGD } from "../DataSaving/DataSaveGD";
import { scraperSerieDetails } from "../../compoments/WebScraping/scraperSerieDetails";
import { getDataGD } from "../../resourcesGD/readFileContentFromDrive";

const idFoldersGD = require("../../data-googleapis/dataIdFolders.json");
const filesResourcesGD = require("../../resources/dataWebPage/webPageLibrary.json");

async function areObjectsEqual(obj1, obj2) {
  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
const scrapeAndSaveSerieDetails = async (serie) => {
  try {
    //scraping de los detalles de la serie segun su url

    const serieDetail = await scraperSerieDetails(serie.urlSerie);
    if (serieDetail) {
      //abro la base de datos de la series
      const seriesGD = await getDataGD(
        idFoldersGD.dataSeries,
        filesResourcesGD.series
      );

      const { idSerie, datasetSeries } = await GenerateUniqueSerieId(
        serieDetail,
        seriesGD
      );

      if (datasetSeries) {
        // Save seriesID
        await DataSaveGD(
          idFoldersGD.dataSeries,
          filesResourcesGD.series,
          datasetSeries
        );
      }
      const newDetails = { idSerie, ...serieDetail };
      //Save SerieDetail
      const { fileFound, data } = await DataSaveGD(
       idFoldersGD.dataSeriesDetails,
        newDetails.idSerie,
        newDetails
      );

      if (fileFound) {
        return { prevDataSerieGD: data, dataSerieGD: newDetails };
      }
      //aqui le digo que genere el serieDetailChapters
      return { prevDataSerieGD: [], dataSerieGD: newDetails };
    }
  } catch (error) {
    console.error("Error al obtener detalles de la serie:", error);
    return null; // Retorna null en caso de error
  }
};

async function DataModelerSerieDetails(serie) {
  try {

    const { prevDataSerieGD, dataSerieGD } = await scrapeAndSaveSerieDetails(
      serie
    );

    let isEqual = false;

    if (Object.keys(prevDataSerieGD).length > 0) {
      isEqual = await areObjectsEqual(
        prevDataSerieGD.chapters,
        dataSerieGD.chapters
      );
    }

    if (isEqual) {
      console.log("Detalles: Se mantienen actualizados");
    }

    return dataSerieGD.idSerie;
  } catch (error) {
    console.error("Error al actualizar los detalles de la serie:", error);
  }
}

export { DataModelerSerieDetails };

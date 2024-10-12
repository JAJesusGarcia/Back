"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./config/data-source");
const server_1 = __importDefault(require("./server"));
const envs_1 = require("./config/envs");
const preloadData_1 = require("./helpers/preloadData");
const initializateApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.AppDataSource.initialize();
        console.log('Conexión a la base de datos realizada con éxito');
        yield (0, preloadData_1.preloadUserData)();
        yield (0, preloadData_1.preloadAppointmentsData)();
        server_1.default.listen(envs_1.PORT, () => {
            console.log(`servidor escuchando en el puerto ${envs_1.PORT}`);
        });
    }
    catch (error) {
        console.error('Error durante la inicialización de la aplicación:', error);
        process.exit(1);
    }
});
initializateApp();
// AppDataSource.initialize().then((res) => {
//   console.log('Conexion a la base de datos realizada con éxito');
//   server.listen(PORT, () => {
//     console.log(`server listening on port ${PORT}`);
//   });
// });
// const initializateApp = async () => {
//   await AppDataSource.initialize();
//   await preloadUserData();
//   await preloadCredentialsData();
//   server.listen(PORT, () => {
//     console.log(`server listening on port ${PORT}`);
//   });
// };
// initializateApp();
// AppDataSource.initialize().then((res) => {
//   console.log('Conexion a la base de datos realizada con éxito');
//   preloadData().then((res) => {
//     server.listen(PORT, () => {
//       console.log(`server listening on port ${PORT}`);
//     });
//   });
// });

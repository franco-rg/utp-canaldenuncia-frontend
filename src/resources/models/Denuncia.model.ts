export interface DenunciaModel {
    idempresa: number;
    idact: number;
    didempresa: string | null;
    idtpodenuncia: number;
    didtpodenuncia: string;
    idreceptor: number;
    didreceptor: string | null;
    idrempresa: number;
    didrempresa: string;
    iformedec: string;
    iformeinv: string;
    iformecom: string;
    iformeden: string;
    nombres: string;
    apellidos: string | null;
    correo: string;
    telefono: string | null;
    fechainc: string;
    detalle: string;
    totalAcciones: number;
    comentarioadi: string;
    contrasena: string;
    correorec: string | null;
    gddenuncia: string;
    dgddenuncia: string;
    jsoN_TESTIGOS: string;
    jsoN_DOCUMENTOS: string;
    jsoN_ACCIONES: any;
    jsoN_USUARIOS: any;
    mrca: string;
    ncmpto: string;
    testigos: any[];  // Puedes definir una interfaz específica si conoces la estructura
    documentos: any[]; // Puedes definir una interfaz específica si conoces la estructura
    chat: any[]; // Puedes definir una interfaz específica si conoces la estructura
    id: number;
    ucrcn: string;
    fcrcn: string;
    uedcn: string;
    fedcn: string;
    gdestdo: string;
    cestdo: string;
    festdo: string | null;
    rn: number;
    totalrows: number;
    desc: string | null;
    init: any | null; // Puedes especificar mejor el tipo si conoces la estructura
    rows: any | null; // Puedes especificar mejor el tipo si conoces la estructura
    draw: any | null; // Puedes especificar mejor el tipo si conoces la estructura
    idmrca: any | null; // Puedes especificar mejor el tipo si conoces la estructura
    permisos: any | null; // Puedes especificar mejor el tipo si conoces la estructura
  }
  
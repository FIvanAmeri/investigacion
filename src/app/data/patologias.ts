export interface Patologia {
  id: string;
  nombre: string;
  descripcion: string;
  contenido: string;
  keywords: string[];
  fuente: string;
  fuenteUrl: string;
}

export const patologias: Patologia[] = [
  {
    id: "incontinencia-urinaria-esfuerzo",
    nombre: "Incontinencia urinaria de esfuerzo",
    descripcion:
      "Pérdida involuntaria de orina que ocurre cuando aumenta la presión dentro del abdomen, por ejemplo al toser, estornudar, reír, correr o realizar actividad física.",
    contenido:
      "La incontinencia urinaria de esfuerzo es una de las formas más frecuentes de incontinencia urinaria. Se produce cuando los mecanismos que mantienen la continencia no logran compensar adecuadamente los aumentos de presión abdominal. Puede relacionarse con alteraciones del soporte uretral y del piso pelviano. La evaluación clínica permite determinar la intensidad de los síntomas, su impacto sobre la calidad de vida y la presencia de otras alteraciones asociadas. Las alternativas terapéuticas dependen de las características de cada paciente y pueden incluir medidas conservadoras, rehabilitación del piso pelviano y tratamientos quirúrgicos seleccionados.",
    keywords: [
      "incontinencia",
      "orina",
      "esfuerzo",
      "tos",
      "estornudo",
      "piso pelviano",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "incontinencia-urinaria-urgencia",
    nombre: "Incontinencia urinaria de urgencia",
    descripcion:
      "Pérdida involuntaria de orina acompañada o precedida por una necesidad repentina y difícil de posponer de orinar.",
    contenido:
      "La incontinencia urinaria de urgencia se encuentra asociada a síntomas de urgencia miccional y puede formar parte del síndrome de vejiga hiperactiva. Las personas pueden presentar deseos repentinos de orinar, aumento de la frecuencia miccional y necesidad de levantarse durante la noche para orinar. La evaluación permite identificar los síntomas predominantes, descartar otras causas y establecer un tratamiento individualizado. El manejo puede incluir modificaciones conductuales, entrenamiento vesical, rehabilitación del piso pelviano y tratamientos farmacológicos o intervencionistas según cada caso.",
    keywords: [
      "incontinencia",
      "urgencia",
      "vejiga",
      "orina",
      "frecuencia miccional",
      "nicturia",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "incontinencia-urinaria-mixta",
    nombre: "Incontinencia urinaria mixta",
    descripcion:
      "Combinación de pérdidas involuntarias de orina relacionadas tanto con el esfuerzo como con síntomas de urgencia miccional.",
    contenido:
      "La incontinencia urinaria mixta presenta características de la incontinencia de esfuerzo y de la incontinencia de urgencia. La evaluación debe establecer cuál de los componentes tiene mayor repercusión sobre los síntomas y la calidad de vida. El tratamiento se determina de manera individual y puede combinar estrategias dirigidas a ambos mecanismos. La identificación adecuada de cada componente es importante para orientar el abordaje terapéutico y valorar la evolución.",
    keywords: [
      "incontinencia",
      "mixta",
      "esfuerzo",
      "urgencia",
      "vejiga",
      "orina",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "prolapso-organos-pelvicos",
    nombre: "Prolapso de órganos pélvicos",
    descripcion:
      "Descenso de uno o más órganos pélvicos hacia el canal vaginal como consecuencia de alteraciones de los tejidos y estructuras de sostén.",
    contenido:
      "El prolapso de órganos pélvicos puede comprometer diferentes compartimentos de la pelvis y presentarse con distintos grados de severidad. Algunas personas pueden no presentar síntomas, mientras que otras pueden referir sensación de peso o bulto vaginal, alteraciones urinarias, intestinales o sexuales. La evaluación clínica permite determinar los compartimentos involucrados y la magnitud del prolapso. Dependiendo de los síntomas, las características anatómicas y las preferencias de la paciente, pueden considerarse estrategias conservadoras, dispositivos vaginales o diferentes alternativas quirúrgicas.",
    keywords: [
      "prolapso",
      "órganos pélvicos",
      "descenso",
      "vejiga",
      "recto",
      "útero",
      "piso pelviano",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "vejiga-hiperactiva",
    nombre: "Vejiga hiperactiva",
    descripcion:
      "Síndrome caracterizado principalmente por urgencia miccional, que puede acompañarse de aumento de la frecuencia urinaria, nocturia e incontinencia de urgencia.",
    contenido:
      "La vejiga hiperactiva se caracteriza por la presencia de urgencia miccional, generalmente acompañada de aumento de la frecuencia urinaria y nocturia, con o sin incontinencia de urgencia. Estos síntomas pueden afectar significativamente las actividades cotidianas, el descanso y la calidad de vida. El diagnóstico es principalmente clínico y debe considerar otras condiciones que pueden producir síntomas similares. El tratamiento puede comenzar con medidas conductuales y entrenamiento vesical, y en determinados casos puede complementarse con otras estrategias terapéuticas.",
    keywords: [
      "vejiga",
      "hiperactiva",
      "urgencia",
      "frecuencia",
      "nocturia",
      "nicturia",
    ],
    fuente: "International Continence Society (ICS)",
    fuenteUrl: "https://www.ics.org/",
  },
  {
    id: "infecciones-urinarias-recurrentes",
    nombre: "Infecciones urinarias recurrentes",
    descripcion:
      "Episodios repetidos de infección urinaria que requieren una evaluación específica para identificar factores predisponentes y establecer una estrategia preventiva.",
    contenido:
      "Las infecciones urinarias recurrentes constituyen un motivo frecuente de consulta. La evaluación debe confirmar que los episodios correspondan realmente a infecciones urinarias y analizar los factores asociados a su recurrencia. Según las características de cada paciente pueden considerarse medidas generales, estrategias de prevención y tratamientos específicos. La historia clínica y, cuando corresponde, los estudios microbiológicos ayudan a orientar el manejo.",
    keywords: [
      "infección",
      "infecciones urinarias",
      "ITU",
      "cistitis",
      "orina",
      "recurrente",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "disfunciones-vaciado-vesical",
    nombre: "Disfunciones del vaciado vesical",
    descripcion:
      "Alteraciones que dificultan el vaciamiento adecuado de la vejiga y pueden producir síntomas como dificultad para iniciar la micción, chorro débil o sensación de vaciado incompleto.",
    contenido:
      "Las alteraciones del vaciado vesical pueden tener diferentes causas y presentaciones clínicas. Los síntomas pueden incluir dificultad para comenzar a orinar, necesidad de realizar esfuerzo, disminución de la fuerza del chorro y sensación de vaciamiento incompleto. La evaluación uroginecológica permite analizar la historia clínica, los síntomas y los hallazgos asociados para determinar el origen del problema. En determinados casos pueden requerirse estudios complementarios para definir el mecanismo involucrado.",
    keywords: [
      "vaciado",
      "vejiga",
      "micción",
      "orinar",
      "retención",
      "chorro débil",
      "disfunción",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "sindrome-genitourinario-menopausia",
    nombre: "Síndrome genitourinario de la menopausia",
    descripcion:
      "Conjunto de síntomas y signos relacionados con los cambios que pueden producirse en los tejidos genitales y urinarios durante la menopausia.",
    contenido:
      "El síndrome genitourinario de la menopausia comprende diferentes síntomas que pueden afectar la región vulvovaginal y el aparato urinario. Entre ellos pueden encontrarse sequedad, irritación, molestias durante las relaciones sexuales y síntomas urinarios. La intensidad y combinación de síntomas varía entre las personas. El abordaje debe considerar los síntomas predominantes, los antecedentes y las preferencias individuales, y puede incluir diferentes alternativas locales y sistémicas según la situación clínica.",
    keywords: [
      "menopausia",
      "síndrome genitourinario",
      "sequedad",
      "vagina",
      "síntomas urinarios",
      "sexualidad",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "dolor-pelvico-cronico",
    nombre: "Dolor pelviano crónico",
    descripcion:
      "Dolor persistente localizado en la región pelviana que puede tener múltiples causas y requerir una evaluación interdisciplinaria.",
    contenido:
      "El dolor pelviano crónico es un cuadro complejo que puede estar relacionado con diferentes estructuras y mecanismos. Puede coexistir con alteraciones urinarias, intestinales, sexuales y musculares. La evaluación requiere considerar la historia clínica, las características del dolor y los síntomas asociados. Debido a su naturaleza multifactorial, el tratamiento puede requerir un abordaje interdisciplinario orientado a las causas y mecanismos identificados en cada paciente.",
    keywords: [
      "dolor",
      "pelvis",
      "pelviano",
      "dolor crónico",
      "piso pelviano",
      "dolor pélvico",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "incontinencia-fecal",
    nombre: "Incontinencia fecal",
    descripcion:
      "Pérdida involuntaria de materia fecal o dificultad para controlar adecuadamente la evacuación intestinal.",
    contenido:
      "La incontinencia fecal puede afectar significativamente la calidad de vida y puede estar relacionada con alteraciones del esfínter anal, del piso pelviano, trastornos intestinales u otros factores. La evaluación debe considerar la frecuencia de los episodios, su relación con la consistencia de las deposiciones y otros síntomas asociados. El tratamiento depende de la causa y puede incluir modificaciones dietarias, regulación del tránsito intestinal, rehabilitación del piso pelviano y otras estrategias seleccionadas.",
    keywords: [
      "incontinencia",
      "fecal",
      "materia fecal",
      "intestino",
      "esfínter",
      "piso pelviano",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "fistulas-urogenitales",
    nombre: "Fístulas urogenitales",
    descripcion:
      "Comunicaciones anormales entre el aparato urinario y el aparato genital que pueden producir pérdida involuntaria y persistente de orina.",
    contenido:
      "Las fístulas urogenitales son comunicaciones anormales entre estructuras del tracto urinario y el aparato genital. Pueden producir pérdidas urinarias persistentes y requieren una evaluación especializada para identificar su localización, características y causa. El diagnóstico y tratamiento dependen del tipo de fístula y de las condiciones clínicas de cada paciente. En determinados casos se requiere una evaluación interdisciplinaria y planificación quirúrgica especializada.",
    keywords: [
      "fístula",
      "urogenital",
      "orina",
      "pérdida urinaria",
      "vagina",
      "vejiga",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "patologia-uretral",
    nombre: "Patología uretral",
    descripcion:
      "Conjunto de alteraciones que pueden afectar la uretra y producir síntomas urinarios, infecciones, dificultades en la micción u otras manifestaciones.",
    contenido:
      "Las alteraciones uretrales comprenden diferentes condiciones que pueden modificar el flujo urinario, producir molestias o favorecer determinados síntomas urinarios. La evaluación requiere caracterizar los síntomas y determinar si existe una alteración anatómica o funcional. Dependiendo del diagnóstico, pueden utilizarse tratamientos conservadores, procedimientos específicos o alternativas quirúrgicas.",
    keywords: [
      "uretra",
      "uretral",
      "estenosis",
      "micción",
      "orina",
      "infección",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "disfunciones-sexuales-piso-pelvico",
    nombre: "Disfunciones sexuales asociadas al piso pelviano",
    descripcion:
      "Alteraciones de la función sexual que pueden relacionarse con síntomas del piso pelviano, dolor, cambios hormonales u otros factores.",
    contenido:
      "Las disfunciones sexuales pueden presentarse junto con diferentes alteraciones uroginecológicas y del piso pelviano. Entre sus manifestaciones pueden encontrarse dolor durante las relaciones sexuales, disminución del deseo, dificultades relacionadas con la respuesta sexual y otras alteraciones. La evaluación debe contemplar factores físicos, funcionales y psicosociales. El tratamiento puede requerir un enfoque interdisciplinario adaptado a las necesidades de cada persona.",
    keywords: [
      "sexualidad",
      "disfunción sexual",
      "dolor",
      "dispareunia",
      "piso pelviano",
      "vagina",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
  {
    id: "trastornos-piso-pelvico-intestinales",
    nombre: "Trastornos intestinales asociados al piso pelviano",
    descripcion:
      "Alteraciones de la función intestinal que pueden estar relacionadas con la coordinación y el funcionamiento del piso pelviano.",
    contenido:
      "Los trastornos intestinales asociados al piso pelviano pueden manifestarse como dificultad para evacuar, sensación de evacuación incompleta, necesidad de realizar maniobras para defecar o alteraciones del control intestinal. La evaluación permite diferenciar los distintos mecanismos involucrados y determinar si existe una alteración de la coordinación de los músculos del piso pelviano. El tratamiento puede incluir medidas relacionadas con el tránsito intestinal, cambios conductuales y rehabilitación especializada.",
    keywords: [
      "constipación",
      "estreñimiento",
      "defecación",
      "evacuación",
      "piso pelviano",
      "intestino",
    ],
    fuente: "Asociación de Uroginecología Argentina (AUGA)",
    fuenteUrl: "https://www.auga.com.ar/",
  },
];
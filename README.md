Portfolio Profesional



Mi Portfolio Profesional desarrollado con Next.js / TypeScript / SCSS, desplegado con Vercel, que sirve como vitrina de mis habilidades, proyectos y experiencia.


---

Tabla de contenidos

Demo

Tecnologías

Características

Estructura del proyecto

Cómo ejecutarlo localmente

Despliegue

Contribuciones

Licencia



---

Demo

Puedes ver el portfolio en vivo aquí:

Portfolio Profesional 


---

Tecnologías

Next.js

TypeScript

SCSS / CSS Modules

Linter / Formateador (ESLint)

Control de versiones (Git)

Vercel para despliegue 



---

Características

Diseño responsive: funciona en escritorio, tablets y móviles.

Secciones típicas de portfolio: acerca de mí, proyectos, habilidades, contacto.

Integración con variables de entorno (.env.example presente) para posibles claves / configuraciones. 

Buenas prácticas de calidad de código: ESLint, configuración de linters, formatos coherentes. 



---

Estructura del proyecto

Aquí un breve resumen de la estructura de carpetas y archivos principales:

./
├── public/               # Archivos estáticos (imágenes, favicon, etc.)
├── src/                  # Código fuente
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas Next.js
│   ├── styles/           # SCSS / estilos globales / módulos
│   └── ...               # Otras utilidades
├── .env.example          # Variables de entorno de ejemplo
├── next.config.mjs       # Configuración de Next.js
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
├── .eslintrc.json        # Configuración del linter
└── LICENSE               # Licencia del proyecto


---

Cómo ejecutarlo localmente

Estos son los pasos básicos para levantarlo en tu máquina local:

1. Clona el repositorio

git clone https://github.com/Jxse111/Portfolio_Profesional.git


2. Entra en la carpeta del proyecto

cd Portfolio_Profesional


3. Instala dependencias

npm install
# o también yarn si prefieres


4. Crea un archivo .env basado en .env.example (si es necesario) y define las variables de entorno que vayas a usar.


5. Ejecuta en modo desarrollo

npm run dev
# o yarn dev


6. Abre en tu navegador en http://localhost:3000




---

Despliegue

El proyecto está configurado para desplegarse fácilmente en Vercel. Los pasos generales son:

Conectar el repositorio GitHub a Vercel.

Vercel detecta automáticamente que es una app Next.js y configura build & deployment.

Asegúrate de definir las variables de entorno en el panel de Vercel si son necesarias.

Cada push al branch principal (o al que hayas definido) hará un despliegue automático.



---

Contribuciones

Si deseas contribuir, las formas más fáciles son:

Abrir un issue para proponer mejoras o reportar bugs.

Hacer un fork del repositorio, crear una rama con tu feature o corrección, y enviar un pull request.

Seguir las guías de estilo que ya están presentes (linting, formato, etc.).




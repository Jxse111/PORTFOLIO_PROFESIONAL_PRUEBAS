# Blog Utils - Documentación

Este conjunto de utilidades avanzadas para blogs está diseñado para mejorar la experiencia del usuario con funcionalidades modernas y una integración perfecta con el sistema de diseño existente.

## 🚀 Características Implementadas

### 1. BlogSearch - Búsqueda Avanzada
- **Búsqueda en tiempo real** por título, resumen, contenido y etiquetas
- **Feedback visual** del término de búsqueda y resultados
- **Interfaz consistente** con el sistema de diseño
- **Debounced search** para mejor rendimiento

### 2. BlogSort - Ordenación Inteligente
- **Múltiples opciones**: más recientes, más antiguos, alfabético
- **Select dropdown** integrado con el sistema de diseño
- **Fácil extensión** con nuevas opciones de ordenación
- **Ordenación en tiempo real**

### 3. BlogStats - Estadísticas Detalladas
- **Total de artículos** y etiquetas únicas
- **Tiempo estimado de lectura** total y promedio
- **Top etiquetas** más populares con visualización
- **Diseño en cards** coherente con el estilo existente

### 4. ReadingProgress - Barra de Progreso
- **Indicador fijo** en la parte superior de la página
- **Tiempo estimado** de lectura y tiempo restante
- **Diseño minimalista** que no interfiere con el contenido
- **Cálculo dinámico** basado en el scroll

### 5. RelatedPosts - Posts Inteligentes
- **Algoritmo basado** en etiquetas comunes
- **Fallback** a posts recientes si no hay coincidencias
- **Grid responsivo** adaptado al número de posts
- **Sistema de puntuación** para relevancia

### 6. EnhancedBlogManager - Gestor Completo
- **Integración** de todas las utilidades en un componente
- **Filtrado combinado** por búsqueda, etiquetas y ordenación
- **Configuración flexible** y estadísticas opcionales
- **Hooks personalizados** para funcionalidades avanzadas

## 📦 Instalación y Uso

### Uso Básico - EnhancedBlogManager

```tsx
import { EnhancedBlogManager } from '@/components/blog';

export default function BlogPage({ posts }) {
  return (
    <EnhancedBlogManager
      initialPosts={posts}
      showSearch={true}
      showSort={true}
      showStats={true}
      enableRelatedPosts={true}
      maxRelatedPosts={3}
      defaultFilters={{
        sort: 'newest',
        showStats: true
      }}
    />
  );
}
```

### Uso Individual de Componentes

```tsx
import {
  BlogSearch,
  BlogSort,
  BlogStats,
  ReadingProgress,
  RelatedPosts
} from '@/components/blog';

function CustomBlogLayout({ posts, currentPost }) {
  return (
    <div>
      {/* Barra de progreso de lectura */}
      <ReadingProgress content={currentPost?.content} />

      {/* Búsqueda */}
      <BlogSearch
        posts={posts}
        onSearch={setFilteredPosts}
        placeholder="Buscar artículos..."
      />

      {/* Ordenación */}
      <BlogSort
        posts={filteredPosts}
        onSort={setSortedPosts}
        defaultSort="newest"
      />

      {/* Estadísticas */}
      <BlogStats posts={posts} showTopTags={true} />

      {/* Posts relacionados */}
      <RelatedPosts
        currentPost={currentPost}
        allPosts={posts}
        maxRelated={4}
      />
    </div>
  );
}
```

### Uso con Hooks Personalizados

```tsx
import { useBlogSearch, useBlogSort, useBlogStats } from '@/utils/blog-utils';

function CustomBlogComponent({ posts }) {
  // Hook de búsqueda
  const { data: searchResults, searchQuery, setSearchQuery } = useBlogSearch(posts);

  // Hook de ordenación
  const { data: sortedPosts, sortOption, setSortOption } = useBlogSort(searchResults, 'newest');

  // Hook de estadísticas
  const { data: stats } = useBlogStats(posts);

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar..."
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
      >
        <option value="newest">Más recientes</option>
        <option value="oldest">Más antiguos</option>
        <option value="alphabetical">A-Z</option>
      </select>

      <div>
        <p>Total de artículos: {stats?.totalPosts}</p>
        <p>Tiempo de lectura: {stats?.totalReadingTime} min</p>
      </div>
    </div>
  );
}
```

## 🎨 Personalización

### Estilos CSS Personalizados

Todas las utilidades usan variables CSS del sistema de diseño:

```css
/* Ejemplo de personalización */
.blog-search {
  --input-border-color: var(--color-neutral-alpha-weak);
  --input-focus-border-color: var(--color-primary);
}

.blog-stats {
  --card-background: var(--color-neutral-weak);
  --card-border: var(--color-neutral-alpha-weak);
}

.reading-progress {
  --progress-background: var(--color-neutral-alpha-weak);
  --progress-foreground: var(--color-primary);
}
```

### Configuración de Componentes

```tsx
// Configuración avanzada
<EnhancedBlogManager
  initialPosts={posts}
  showSearch={{
    placeholder: "Buscar en mi blog...",
    debounceMs: 500,
    minSearchLength: 2
  }}
  showSort={{
    defaultSort: 'alphabetical',
    showPostCount: true
  }}
  showStats={{
    showTopTags: true,
    maxTopTags: 5,
    showReadingTime: true
  }}
  enableRelatedPosts={{
    maxRelated: 6,
    showReason: true
  }}
/>
```

## 🔧 Configuración Avanzada

### Hooks con Opciones

```tsx
const searchHook = useBlogSearch(posts, {
  debounceMs: 300,
  minSearchLength: 1,
  cacheResults: true
});

const sortHook = useBlogSort(posts, 'newest');
const statsHook = useBlogStats(posts);
const relatedHook = useRelatedPosts(currentPost, posts, 4);
```

### Manejo de Estados

```tsx
function BlogWithStateManagement() {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      // Lógica de búsqueda personalizada
      const results = await searchPosts(query);
      setPosts(results);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogSearch posts={posts} onSearch={handleSearch} />
  );
}
```

## 📱 Responsive Design

Todas las utilidades están optimizadas para diferentes tamaños de pantalla:

- **Desktop**: Layout completo con todas las funcionalidades
- **Tablet**: Componentes adaptados con columnas responsivas
- **Mobile**: Diseño simplificado y optimizado para touch

## ♿ Accesibilidad

- **ARIA labels** apropiados en todos los componentes
- **Keyboard navigation** completa
- **Screen reader** compatible
- **Color contrast** que cumple con WCAG guidelines
- **Focus management** adecuado

## 🔄 Migración desde BlogClient

Para migrar desde el `BlogClient` existente:

```tsx
// Antes
import BlogClient from '@/app/blog/BlogClient';

// Después
import { EnhancedBlogManager } from '@/components/blog';

function BlogPage({ initialPosts }) {
  return (
    <EnhancedBlogManager
      initialPosts={initialPosts}
      showSearch={true}
      showSort={true}
      showStats={true}
    />
  );
}
```

## 🚀 Próximas Mejoras

- [ ] Búsqueda avanzada con filtros por fecha
- [ ] Integración con sistema de comentarios
- [ ] Análisis de posts más leídos
- [ ] Exportación de estadísticas
- [ ] Modo oscuro específico para blog
- [ ] Integración con redes sociales
- [ ] SEO mejorado para posts

## 🐛 Troubleshooting

### Problemas Comunes

1. **Componentes no se renderizan**
   - Verifica que los posts tengan la estructura correcta
   - Asegúrate de que las importaciones sean correctas

2. **Búsqueda no funciona**
   - Verifica que el contenido de los posts esté disponible
   - Revisa la configuración de `minSearchLength`

3. **Estadísticas incorrectas**
   - Asegúrate de que las fechas estén en formato ISO
   - Verifica que los tags estén correctamente formateados

### Debug

```tsx
// Debug mode
<EnhancedBlogManager
  initialPosts={posts}
  debug={true} // Muestra información de debug
/>
```

## 📄 Licencia

Este conjunto de utilidades está incluido en el proyecto principal y sigue la misma licencia.

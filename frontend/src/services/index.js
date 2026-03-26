// Re-exporta todo desde los servicios individuales.
// Los archivos que aún importen desde '../api/api' pueden actualizarse
// gradualmente para apuntar al servicio específico que necesiten.
export * from './auth.service'
export * from './users.service'
export * from './events.service'
export * from './categories.service'
export { API_BASE } from './config'

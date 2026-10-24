export const STATUSES=['pendiente','en progreso','completada'];
export const PRIORITIES=['baja','media','alta'];
export function createTask(title,priority='media',id=crypto.randomUUID()){
 const clean=title.trim();if(!clean)throw Error('Título obligatorio');
 if(!PRIORITIES.includes(priority))throw Error('Prioridad inválida');
 return {id,title:clean,priority,status:'pendiente'};
}
export function updateTask(tasks,id,changes){
 if(!tasks.some(t=>t.id===id))throw Error('No encontrada');
 if(changes.title!==undefined&&!changes.title.trim())throw Error('Título obligatorio');
 if(changes.status!==undefined&&!STATUSES.includes(changes.status))throw Error('Estado inválido');
 if(changes.priority!==undefined&&!PRIORITIES.includes(changes.priority))throw Error('Prioridad inválida');
 return tasks.map(t=>t.id===id?{...t,...changes,title:changes.title===undefined?t.title:changes.title.trim()}:t);
}
export const deleteTask=(tasks,id)=>tasks.filter(t=>t.id!==id);
export const filterTasks=(tasks,{search='',status='todas',priority='todas'}={})=>tasks.filter(t=>t.title.toLowerCase().includes(search.toLowerCase().trim())&&(status==='todas'||t.status===status)&&(priority==='todas'||t.priority===priority));
export const stats=tasks=>({total:tasks.length,pending:tasks.filter(t=>t.status==='pendiente').length,completed:tasks.filter(t=>t.status==='completada').length});
import {describe,it,expect} from 'vitest';
import {createTask,updateTask,deleteTask,filterTasks,stats} from '../../src/tasks.js';
const sample=[createTask('Diseñar','alta','1'),createTask('Probar','baja','2')];
describe('Unitarias',()=>{
it('crea tarea',()=>expect(createTask('Nueva','media','3').title).toBe('Nueva'));
it('recorta espacios',()=>expect(createTask('  Nueva  ','media','3').title).toBe('Nueva'));
it('rechaza título vacío',()=>expect(()=>createTask('   ')).toThrow());
it('rechaza prioridad inválida',()=>expect(()=>createTask('Tarea','otra')).toThrow());
it('inicia pendiente',()=>expect(createTask('Tarea').status).toBe('pendiente'));
it('cuenta total',()=>expect(stats(sample).total).toBe(2));
it('cuenta pendientes',()=>expect(stats(sample).pending).toBe(2));
it('cuenta completadas',()=>expect(stats(updateTask(sample,'1',{status:'completada'})).completed).toBe(1));
it('filtra por texto',()=>expect(filterTasks(sample,{search:'dise'})).toHaveLength(1));
it('filtra por prioridad',()=>expect(filterTasks(sample,{priority:'alta'})).toHaveLength(1));
it('elimina',()=>expect(deleteTask(sample,'1')).toHaveLength(1));
it('rechaza estado inválido',()=>expect(()=>updateTask(sample,'1',{status:'otro'})).toThrow());
});
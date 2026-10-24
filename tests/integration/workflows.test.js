import {describe,it,expect} from 'vitest';
import {createTask,updateTask,deleteTask,stats} from '../../src/tasks.js';
import {loadTasks,saveTasks} from '../../src/storage.js';
const store=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}};
describe('Integración',()=>{
it('guarda y recupera',()=>{const s=store();saveTasks(s,[createTask('A','media','a')]);expect(loadTasks(s)).toHaveLength(1)});
it('restaura vacío',()=>expect(loadTasks(store())).toEqual([]));
it('tolera datos corruptos',()=>{const s=store();s.setItem('taskflow-items-v1','mal');expect(loadTasks(s)).toEqual([])});
it('tolera formato inesperado',()=>{const s=store();s.setItem('taskflow-items-v1','{}');expect(loadTasks(s)).toEqual([])});
it('crea y completa',()=>{const t=updateTask([createTask('A','alta','a')],'a',{status:'completada'});expect(stats(t).completed).toBe(1)});
it('edita título',()=>expect(updateTask([createTask('A','media','a')],'a',{title:' B '})[0].title).toBe('B'));
it('rechaza inexistente',()=>expect(()=>updateTask([],'no',{title:'X'})).toThrow());
it('elimina y guarda',()=>{const s=store();saveTasks(s,deleteTask([createTask('A','media','a')],'a'));expect(loadTasks(s)).toHaveLength(0)});
});
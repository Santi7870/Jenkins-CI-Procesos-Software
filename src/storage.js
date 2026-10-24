const KEY='taskflow-items-v1';
export function loadTasks(storage){try{const value=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(value)?value.filter(t=>t&&typeof t.id==='string'&&typeof t.title==='string'):[];}catch{return [];}}
export function saveTasks(storage,tasks){storage.setItem(KEY,JSON.stringify(tasks));}
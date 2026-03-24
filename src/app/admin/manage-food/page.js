"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ManageFood() {
  const [foods, setFoods] = useState([]);
  const [edit, setEdit] = useState(null);
  const colors = { primary: "rgba(178,60,47,1)", bg: "rgba(251,244,236,1)", card: "rgba(69,50,26,1)" };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "foods"), snap => setFoods(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleDelete = async id => { if(confirm("Delete this food?")) await deleteDoc(doc(db, "foods", id)); };
  const handleUpdate = async () => { await updateDoc(doc(db, "foods", edit.id), { name: edit.name, fullPrice: Number(edit.fullPrice), halfPrice: Number(edit.halfPrice), category: edit.category }); setEdit(null); };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>
        <div className="min-h-screen p-6" style={{ backgroundColor: colors.bg }}>
          <h1 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>Manage Foods 🍔</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {foods.map(food => (
              <div key={food.id} className="p-5 rounded-xl shadow" style={{ backgroundColor: colors.card }}>
                {food.image && <img src={food.image} className="w-full h-40 object-cover rounded mb-3"/>}
                <h2 className="text-white font-semibold text-lg">{food.name}</h2>
                <p className="text-gray-300">Category: {food.category}</p>
                <p className="text-white">Half: Rs {food.halfPrice}</p>
                <p className="text-white">Full: Rs {food.fullPrice}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setEdit(food)} className="px-3 py-1 rounded" style={{ backgroundColor: colors.primary, color: "white" }}>Edit</button>
                  <button onClick={() => handleDelete(food.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {edit && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-6 rounded-xl w-full max-w-md" style={{ backgroundColor: colors.card }}>
                <h2 className="text-white mb-4 text-lg">Edit Food</h2>
                <input className="w-full p-2 mb-2 rounded" value={edit.name} onChange={e => setEdit({...edit, name:e.target.value})}/>
                <input type="number" className="w-full p-2 mb-2 rounded" value={edit.halfPrice} onChange={e => setEdit({...edit, halfPrice:e.target.value})}/>
                <input type="number" className="w-full p-2 mb-2 rounded" value={edit.fullPrice} onChange={e => setEdit({...edit, fullPrice:e.target.value})}/>
                <select className="w-full p-2 mb-4 rounded" value={edit.category} onChange={e => setEdit({...edit, category:e.target.value})}>
                  <option value="pizza">Pizza</option>
                  <option value="burger">Burger</option>
                  <option value="momo">Momo</option>
                  <option value="chicken">Chicken</option>
                  <option value="drinks">Drinks</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEdit(null)} className="px-3 py-1 bg-gray-500 text-white rounded">Cancel</button>
                  <button onClick={handleUpdate} className="px-3 py-1 text-white rounded" style={{ backgroundColor: colors.primary }}>Save</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
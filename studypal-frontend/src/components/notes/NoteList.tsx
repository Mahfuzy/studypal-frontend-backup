import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../services/studyServices';
import { Note } from '../../services/types';

const NoteList: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const now = new Date().toISOString();
  const [newNote, setNewNote] = useState<Omit<Note, 'id'>>({
    title: '',
    content: '',
    userId: 1, // TODO: Get actual user ID from auth context
    sessionId: 1, // TODO: Get actual session ID from current study session
    createdAt: now,
    updatedAt: now
  });

  const { data: notes, isLoading, error } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await noteService.getNotes();
      return response.data;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: (note: Omit<Note, 'id'>) => noteService.createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsCreating(false);
      setNewNote({
        title: '',
        content: '',
        userId: 1,
        sessionId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (params: { id: number; note: Partial<Note> }) =>
      noteService.updateNote(params.id, {
        ...params.note,
        updatedAt: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setEditingNote(null);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => noteService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    createNoteMutation.mutate(newNote);
  };

  const handleUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      updateNoteMutation.mutate({
        id: editingNote.id,
        note: editingNote,
      });
    }
  };

  if (isLoading) return <div>Loading notes...</div>;
  if (error) return <div>Error loading notes</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Notes</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Create Note Form */}
      {isCreating && (
        <form onSubmit={handleCreateNote} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              placeholder="Note Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={6}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Note
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes?.map((note) => (
          <div key={note.id} className="p-4 bg-white rounded-lg shadow">
            {editingNote?.id === note.id ? (
              <form onSubmit={handleUpdateNote} className="space-y-4">
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{note.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNoteMutation.mutate(note.id)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 prose prose-sm">
                  <pre className="whitespace-pre-wrap">{note.content}</pre>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                  <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList; 
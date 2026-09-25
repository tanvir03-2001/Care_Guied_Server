import { AppError } from '../../shared/middleware/error.middleware';
import { AuthUser } from '../../shared/types/express.d';
import { parsePagination, paginatedResult } from '../../shared/utils/pagination';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { Note } from './note.model';

export class NoteService {
  async create(ownerId: string, dto: CreateNoteDto) {
    if (!dto.title || !dto.content) {
      throw new AppError('Title and content are required');
    }
    const note = await Note.create({
      title: dto.title,
      content: dto.content,
      owner: ownerId,
    });
    return note;
  }

  async list(user: AuthUser, query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter = user.role === 'admin' ? {} : { owner: user.id };

    const [data, total] = await Promise.all([
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(filter),
    ]);
    return paginatedResult(data, total, page, limit);
  }

  async getById(user: AuthUser, id: string) {
    const note = await Note.findById(id);
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    if (user.role !== 'admin' && note.owner.toString() !== user.id) {
      throw new AppError('Forbidden', 403);
    }
    return note;
  }

  async update(user: AuthUser, id: string, dto: UpdateNoteDto) {
    const note = await this.getById(user, id);
    if (dto.title !== undefined) note.title = dto.title;
    if (dto.content !== undefined) note.content = dto.content;
    await note.save();
    return note;
  }

  async remove(user: AuthUser, id: string) {
    const note = await this.getById(user, id);
    await note.deleteOne();
    return { message: 'Note deleted' };
  }
}

export const noteService = new NoteService();

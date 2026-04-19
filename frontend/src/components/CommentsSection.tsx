import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { commentsService } from '../api';
import type { Comment, Listing } from '../types';
import { Button, Card, Input } from './index';
import { User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentsSectionProps {
  listing: Listing;
}

export const CommentsSection = ({ listing }: CommentsSectionProps) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const res = await commentsService.getCommentsByListingId(listing.id);
      if (res.success && res.data) {
        setComments(res.data);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [listing.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    const res = await commentsService.addComment(listing.id, newComment);
    if (res.success && res.data) {
      setComments((prev) => [...prev, res.data!]);
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="mt-8 animate-pulse bg-slate-200 h-32 rounded-xl"></div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Комментарии</h2>

      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-slate-500">Пока нет комментариев. Будьте первым!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex gap-4">
                <Link to={`/profile/${comment.user.id}`}>
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer">
                    {comment.user.avatar ? (
                      <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${comment.user.id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                      {comment.user.name}
                    </Link>
                    {comment.user_id === listing.owner.id && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Автор
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            className="flex-1"
          />
          <Button type="submit" isLoading={isSubmitting} disabled={!newComment.trim()}>
            Отправить
          </Button>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            Пожалуйста, <Link to="/login" className="text-blue-600 hover:underline font-medium">войдите</Link>, чтобы оставить комментарий.
          </p>
        </div>
      )}
    </div>
  );
};

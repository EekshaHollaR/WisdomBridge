import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, Search, Filter, BookOpen, User, Calendar, Tag, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const EXPERTISE_AREAS = [
  { value: 'all', label: 'All Areas' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'other', label: 'Other' },
];

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  knowledge_type: string | null;
  created_at: string;
  expert: {
    full_name: string;
    job_title: string | null;
    department: string | null;
  } | null;
}

export default function KnowledgeLibrary() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchKnowledge();
  }, [categoryFilter]);

  const fetchKnowledge = async () => {
    setLoading(true);
    let query = supabase
      .from('knowledge_items')
      .select(`
        id, title, content, category, tags, knowledge_type, created_at,
        expert:profiles!knowledge_items_expert_id_fkey (full_name, job_title, department)
      `)
      .order('created_at', { ascending: false });

    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    const { data, error } = await query;
    
    if (!error && data) {
      setItems(data.map(item => ({
        ...item,
        expert: item.expert as KnowledgeItem['expert']
      })));
    }
    setLoading(false);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.content.toLowerCase().includes(search.toLowerCase()) ||
    item.expert?.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">WisdomBridge</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Knowledge Library
          </h1>
          <p className="text-muted-foreground">
            {role === 'expert' ? 'View and manage your captured knowledge' : 'Explore expert knowledge from your organization'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              {EXPERTISE_AREAS.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Knowledge grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No knowledge items found</h3>
              <p className="text-muted-foreground mb-4">
                {role === 'expert' 
                  ? 'Start an interview session to capture your expertise.'
                  : 'Check back later for new expert knowledge.'}
              </p>
              {role === 'expert' && (
                <Button onClick={() => navigate('/interview')}>
                  Start Interview
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-border/50 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => navigate(`/knowledge/${item.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {EXPERTISE_AREAS.find(a => a.value === item.category)?.label || 'General'}
                    </Badge>
                    <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="font-display line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {item.content.slice(0, 150)}...
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <User className="w-4 h-4" />
                    <span>{item.expert?.full_name || 'Unknown Expert'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(item.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

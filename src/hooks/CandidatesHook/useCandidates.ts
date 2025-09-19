import { useState, useEffect, useMemo } from 'react';
import * as candidateService from '../../data/CandidatesData/CandidateFunctions';
import type { Candidate } from '../../data/CandidatesData/mockCandidates';

export const useCandidates = () => {
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getCandidates = async () => {
      setIsLoading(true);
      const data = await candidateService.fetchCandidates(stageFilter);
      setAllCandidates(data);
      setIsLoading(false);
    };
    getCandidates();
  }, [stageFilter]);

  const searchedCandidates = useMemo(() => {
    if (!searchTerm) {
      return allCandidates;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return allCandidates.filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [allCandidates, searchTerm]);

  return {
    isLoading,
    searchedCandidates,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
  
    setAllCandidates, 
    
  };
};
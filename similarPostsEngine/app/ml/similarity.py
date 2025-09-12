from app.ml.model import model
from app.db.postsService import fetch_post_by_id
import logging
import numpy as np
import faiss

logger = logging.getLogger('uvicorn.error')


def find_similar_posts(query_text: str, top_k: int = 5, similarity_threshold: float = 0.5):
    """
    Find similar posts based on query text using cosine similarity.
    
    Args:
        query_text: The text to search for similar posts
        top_k: Maximum number of results to return
        similarity_threshold: Minimum cosine similarity score (0-1) for results
    
    Returns:
        List of similar posts with similarity scores and confidence levels
    """
    try:
        if not query_text or not query_text.strip():
            logger.warning("Empty query text provided")
            return []
            
        if model.get_index_size() == 0:
            logger.warning("No posts in index")
            return []
            
        # Encode and normalize query vector for cosine similarity
        query_vec = model.model.encode([query_text], convert_to_numpy=True)
        query_vec = query_vec.astype(np.float32)
        faiss.normalize_L2(query_vec)
        
        # Search returns cosine similarities (higher is better)
        similarities, indices = model.index.search(query_vec, min(top_k, model.get_index_size()))

        results = []
        added_post_ids = set()
        for similarity, post_index in zip(similarities[0], indices[0]):
            if post_index >= 0 and post_index < len(model.posts):  # Check for valid index
                # Cosine similarity is already between -1 and 1, we convert to 0-1 range
                cosine_similarity = float(similarity)
                similarity_score = max(0.0, cosine_similarity)  # Ensure non-negative
                
                # Only include results above threshold
                if similarity_score >= similarity_threshold:
                    post_id = str(model.posts[post_index]["_id"])
                    if post_id not in added_post_ids:
                        post = fetch_post_by_id(post_id)
                        if post:  # Make sure post exists
                            post["similarity_score"] = similarity_score
                            post["cosine_similarity"] = cosine_similarity
                            post["confidence"] = _calculate_confidence(similarity_score)
                            results.append(post)
                            added_post_ids.add(post_id)

        # Results are already sorted by similarity (highest first) from FAISS
        return results
        
    except Exception as e:
        logger.error(f"Error finding similar posts: {e}")
        return []


def _calculate_confidence(similarity_score: float) -> str:
    """Calculate confidence level based on cosine similarity score."""
    if similarity_score >= 0.85:
        return "very_high"
    elif similarity_score >= 0.75:
        return "high"
    elif similarity_score >= 0.65:
        return "medium"
    elif similarity_score >= 0.5:
        return "low"
    else:
        return "very_low"

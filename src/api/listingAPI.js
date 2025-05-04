// src/api/listingAPI.js
import API from './config';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Get all listings
export const getAllListings = async () => {
  try {
    const response = await API.get('/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Get listing by ID
export const getListingById = async (id) => {
  try {
    const response = await API.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    throw error;
  }
};

// Search listings with parameters (combined function)
export const searchListings = async (params) => {
  try {
    const { lat, lng, page, pageSize, filters, moreFilters, radius } = params;

    const queryParams = new URLSearchParams({
      lat,
      lng,
      page,
      pageSize,
    });

    if (radius) {
      queryParams.append('radius', radius);
    }

    if (filters && filters.length > 0) {
      queryParams.append('filters', JSON.stringify(filters));
    }

    if (moreFilters) {
      queryParams.append('moreFilters', JSON.stringify(moreFilters));
    }

    // ✅ Use shared API instance (which includes the baseURL from env)
    const response = await API.get(`/listings/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};
// For provider to add listings
export const createListing = async (listingData) => {
  try {
    const response = await API.post('/providers/add-listing', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// For provider to update listings
export const updateListing = async (id, listingData) => {
  try {
    const response = await API.put(`/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// For provider to delete listings
export const deleteListing = async (id) => {
  try {
    const response = await API.delete(`/providers/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// For provider to get their own listings
export const getProviderListings = async () => {
  try {
    const response = await API.get('/providers/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider listings:', error);
    throw error;
  }
};

// For provider to get bookings for their listings
export const getProviderBookings = async (status = 'all') => {
  try {
    const response = await API.get('/providers/bookings', { params: { status } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw error;
  }
};

// For provider to get earnings data
export const getProviderEarnings = async (timeFrame = 'all') => {
  try {
    const response = await API.get('/providers/earnings', { params: { timeFrame } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider earnings:', error);
    throw error;
  }
};

// For provider to get transactions
export const getProviderTransactions = async (params = {}) => {
  try {
    const response = await API.get('/providers/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider transactions:', error);
    throw error;
  }
};

// For provider to get dashboard stats - UPDATED with correct endpoint
export const getProviderDashboardStats = async (timeFrame = 'month') => {
  try {
    // Changed from '/dashboard' to '/analytics' to match backend route
    const response = await API.get('/providers/analytics', { params: { timeRange: timeFrame } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider dashboard stats:', error);
    throw error;
  }
};

// Fetch listings by map bounds
export const fetchListingsByMapBounds = async (params) => {
  try {
    const { lat, lng, radius, bounds, page = 1, limit = 20, filters = {} } = params;

    const queryParams = new URLSearchParams({
      lat,
      lng,
      radius: radius || 1000,
      page,
      limit,
    });

    // Add filters to query (assumes flat key-value structure)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    if (bounds) {
      queryParams.append('neLat', bounds.ne.lat);
      queryParams.append('neLng', bounds.ne.lng);
      queryParams.append('swLat', bounds.sw.lat);
      queryParams.append('swLng', bounds.sw.lng);
    }

    const response = await API.get(`/listings/map?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listings by map bounds:', error);
    throw error;
  }
};
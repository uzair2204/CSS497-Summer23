package com.mehvi.lady.webapplication.services;

import com.mehvi.lady.webapplication.entities.Services;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ServicesService {
    // Save a single services
    Services saveServices(Services services);

    // Save a collection of services
    List<Services> saveAllServices(List<Services> services);

    // Get all services
    Page<Services> getAllServices(Pageable pageable);

    // Get a services by its ID
    Optional<Services> getServicesById(Long id);

    // Check if a services with the given ID exists in the database
    boolean servicesExists(Long id);

    // Get all services
    List<Services> getAllServices();

    // Get services by a list of IDs
    List<Services> getServicesByIds(List<Long> ids);

    // Get the total number of services in the database
    long getServicesCount();

    // Delete a services by its ID
    void deleteServicesById(Long id);

    // Delete a single services
    void deleteServices(Services services);
}

package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oep.entities.Batch;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}

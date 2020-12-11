package com.PDOAReplayer.PDOA.Repositories.Interfaces;

import com.PDOAReplayer.PDOA.Entities.Hands;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface HandsRepository extends JpaRepository<Hands, Long> {
    @Query(value = "SELECT * FROM hands ORDER BY id DESC", nativeQuery = true)
    Long getLast();
}

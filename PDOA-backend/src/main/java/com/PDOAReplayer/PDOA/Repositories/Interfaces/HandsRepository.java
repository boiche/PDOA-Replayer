package com.PDOAReplayer.PDOA.Repositories.Interfaces;

import com.PDOAReplayer.PDOA.Entities.Hands;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HandsRepository extends JpaRepository<Hands, Long> {
    @Query(value = "SELECT * FROM hands ORDER BY id DESC", nativeQuery = true)
    Long getLast();

    @Query(value = "SELECT u.id FROM hands u WHERE u.hand_board = :hand AND u.owner = :owner", nativeQuery = true)
    Long getId(@Param("hand") String hand, @Param("owner") Long owner);
}

package com.store.dev.web.api;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.AdmDTO;
import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.Resource;


@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;
    
    @GetMapping("")
    public ResponseDTO searchList(SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        SearchResDTO resDTO = new SearchResDTO();

        List<StoreDTO> list = null;
        List<AdmDTO> sdList = null;
        List<AdmDTO> sggList = null;
        int count;
        
        if(!searchDTO.getType1().equals("my")){
            list = storeService.selectListStore(searchDTO);
            count = storeService.selectListStoreByCount(searchDTO);
            sdList = storeService.selectListSdCluster(searchDTO);
            sggList = storeService.selectListSggCluster(searchDTO);

        } else{
            list = storeService.selectListStoreByDistance(searchDTO);
            count = storeService.selectListStoreCountByDistance(searchDTO);
        }
        
        resDTO.setList(list);
        resDTO.setCount(count);
        
        res.setStatus("success");
        res.setErrCode(null);
        res.setResult(list);
        res.setSdResult(sdList);
        res.setSggResult(sggList);
        res.setResultCnt(count);
        return res;
    }

   
    @GetMapping("/info")
    public String getMethodName(@RequestParam int seq, @RequestParam String category, @RequestParam String name, @RequestParam String doro , @RequestParam String jibeon) {
        WebDriverManager.chromedriver().setup();
        WebDriver driver = new ChromeDriver();
        JavascriptExecutor js = (JavascriptExecutor) driver;

        driver.get("https://www.diningcode.com/");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        
        // 검색 필드를 찾아 검색어 입력
        WebElement searchField = driver.findElement(By.xpath("//*[@id=\"root\"]/header/div/div/div[2]/div/input"));
        searchField.sendKeys("홍콩반점0410 인천서구청점");
        WebElement click1 = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"root\"]/header/div/div/div[2]/div/button[2]")));
        js.executeScript("arguments[0].click();", click1);

        // 1. 현재 열려있는 모든 창의 핸들을 저장합니다.
        Set<String> existingWindowHandles = driver.getWindowHandles();

        WebElement click2 = driver.findElement(By.xpath("//*[@id=\"root\"]/div/main/div[2]/div[3]/ol/li/a/div[1]/div/div[1]/h1"));
        click2.click();

        // 새 창이 열릴 때까지 기다립니다.
        boolean newWindowFound = new WebDriverWait(driver, Duration.ofSeconds(15)).until((WebDriver d) -> {
            Set<String> currentWindowHandles = d.getWindowHandles();
            currentWindowHandles.removeAll(existingWindowHandles); // 기존 핸들을 제거합니다.
            return currentWindowHandles.size() == 1; // 정확히 하나의 새 창이 열렸는지 확인합니다.
        });

        if (newWindowFound) {
            // 새 창으로 전환합니다.
            String newWindowHandle = driver.getWindowHandles().stream()
                    .filter(handle -> !existingWindowHandles.contains(handle))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("새 창 핸들을 찾을 수 없습니다."));
            driver.switchTo().window(newWindowHandle);

            // 새 창에서의 작업을 수행합니다.
            System.out.println("새 창 URL: " + driver.getCurrentUrl());
        } else {
            System.out.println("새 창이 시간 내에 열리지 않았습니다.");
        }

        WebElement click3 = driver.findElement(By.xpath("//*[@id=\"div_detail\"]/div[3]/p[2]/a/span"));
        click3.click();
        
        WebElement reviewContainer1 = wait
                .until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".list.Restaurant_MenuList")));

        List<WebElement> reviewElements1 = driver.findElements(By.cssSelector(".list.Restaurant_MenuList"));
        
        List<String> reviews1 = new ArrayList<>();
        for (WebElement reviewElement : reviewElements1) {
            reviews1.add(reviewElement.getText());
        }

        // 리뷰 내용을 콘솔에 출력합니다.
        for (String review : reviews1) {
            if (review.isEmpty()) {
                continue;
            }
            System.out.println(review);
        }

        driver.quit();
        return "크롤링 완료";
    }
    
}
